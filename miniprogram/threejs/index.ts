import * as THREE from 'three-platformize'
import { WechatPlatform } from 'three-platformize/src/WechatPlatform'
import { OrbitControls } from 'three-platformize/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three-platformize/examples/jsm/loaders/GLTFLoader'

export { OrbitControls }

export class ThreeInstance {
  public canvasId: string
  public canvasNode: any
  public camera: any
  public control: any
  public renderer: any
  public mainScene: any
  public defaultAmbientLight: any
  public defaultDirectLight: any
  public render: Function
  public animationMixer: any
  public clock: any
  public actions: any[]
  public disposing: boolean
  public platform: WechatPlatform
  /**
   * @desc 传入画布的DOM节点，生成THREE实例
   * @param Object
   */
  constructor(canvas: any) {
    console.log('【ThreeInstance构造函数执行】')

    const platform = new WechatPlatform(canvas)
    platform.enableDeviceOrientation('normal')
    THREE.PLATFORM.set(platform)
    this.platform = platform
    this.canvasId = canvas._canvasId
    this.canvasNode = canvas
    this.disposing = false
    this.render = () => {}
    this.actions = []
  }
  /**
   * @desc 初始化场景并渲染，返回主场景对象
   * @param sceneConfig 场景配置
   * @param wxCtx 当前页面维护的实例this，用于自动绑定OrbitControls事件回调
   */
  public init(sceneConfig: Scene, wxCtx: any): object {
    const {
      cameraFov,
      cameraNear,
      cameraFar,
      cameraPosition,
      cameraLookAt,
      light,
      backGroundColor,
      meshUrl,
      meshOffsetY,
      onloadCallback
    } = sceneConfig

    const camera = new THREE.PerspectiveCamera(
      cameraFov || 45,
      this.canvasNode.width / this.canvasNode.height,
      cameraNear || 0.1,
      cameraFar || 2000
    )
    if (cameraPosition) camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2])
    else camera.position.set(10, 10, 20)

    const mainScene = new THREE.Scene()
    mainScene.background = new THREE.Color(backGroundColor || 0xaaaaaa)

    if (light) mainScene.add(light)
    const defaultAmbientLight = new THREE.AmbientLight(0xffffff, 1)
    const defaultDirectLight = new THREE.DirectionalLight(0xffffff, 1.0)
    mainScene.add(defaultAmbientLight)
    mainScene.add(defaultDirectLight)

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvasNode,
      antialias: true,
      alpha: true
    })
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setSize(this.canvasNode.width, this.canvasNode.height)
    renderer.setPixelRatio(THREE.$window.devicePixelRatio)

    const loader = new GLTFLoader()
    const fs = wx.getFileSystemManager()
    const content = fs.readFileSync(meshUrl)
    loader.parse(
      content,
      meshUrl,
      (res: GLTF) => {
        // @ts-ignore
        res.parser = null
        const mesh = res.scene
        mesh.position.y -= meshOffsetY
        if (cameraLookAt)
          camera.lookAt(new THREE.Vector3(cameraLookAt[0], cameraLookAt[1], cameraLookAt[2]))
        else camera.lookAt(mesh.position)
        if (res.animations.length > 0) {
          const mixer = new THREE.AnimationMixer((mesh as unknown) as THREE.Object3D)
          this.animationMixer = mixer
          const actions: any[] = []
          for (let i = 0; i < res.animations.length; i++)
            actions[i] = mixer.clipAction(res.animations[i])
          this.actions = actions
        }
        if (onloadCallback) onloadCallback(res)
        mainScene.add(mesh)
      },
      e => console.log(e)
    )
    // loader.load(meshUrl, (res: GLTF) => {
    //   console.log(res)
    //   const mesh = res.scene
    //   mesh.position.y -= meshOffsetY
    //   if (cameraLookAt)
    //     camera.lookAt(new THREE.Vector3(cameraLookAt[0], cameraLookAt[1], cameraLookAt[2]))
    //   else camera.lookAt(mesh.position)
    //   if (res.animations.length > 0) {
    //     const mixer = new THREE.AnimationMixer((mesh as unknown) as THREE.Object3D)
    //     this.animationMixer = mixer
    //     const actions: any[] = []
    //     for (let i = 0; i < res.animations.length; i++)
    //       actions[i] = mixer.clipAction(res.animations[i])
    //     this.actions = actions
    //   }
    //   if (onloadCallback) onloadCallback(res)
    //   mainScene.add(mesh)
    // })
    const control = new OrbitControls(camera, this.canvasNode)
    control.enableDamping = true

    this.camera = camera
    this.control = control
    this.renderer = renderer
    this.mainScene = mainScene
    this.defaultAmbientLight = defaultAmbientLight
    this.defaultDirectLight = defaultDirectLight

    const clock = new THREE.Clock()
    this.clock = clock

    this.render = (): void => {
      if (this.disposing) return
      const time = this.clock.getDelta()
      if (this.animationMixer) this.animationMixer.update(time)
      // type FrameRequestCallback = (callback: FrameRequestCallback) => number
      let myRender: FrameRequestCallback = this.render as FrameRequestCallback
      THREE.$requestAnimationFrame(myRender)
      control.update()
      renderer.render(this.mainScene, this.camera)
    }

    wxCtx.touchEventHandler = (e: any) => {
      this.platform.dispatchTouchEvent(e)
    }
    wxCtx.onUnload = () => {
      this.platform.dispose()
    }
    this.render()
    return mainScene
  }
}
export interface Scene {
  cameraFov?: number
  cameraNear?: number
  cameraFar?: number
  backGroundColor?: number
  cameraPosition?: number[]
  cameraLookAt?: number[]
  light?: any
  meshUrl: string
  meshOffsetY: number
  onloadCallback?: (res: any) => void
}
