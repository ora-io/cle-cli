class MockDspHub {
  hub = new Map<string, MockDspPlugin>()
}

class MockDspPlugin {
  static execParams: string[] = []
  static proveParams: string[] = []
}

const dspHub = new MockDspHub()

class Test1 extends MockDspPlugin {
  static execParams = ['a', 'b']
  static proveParams = ['c', 'd']
}
class Test2 extends MockDspPlugin {
  static execParams = ['1', '2']
  static proveParams = ['3', '4']
}

dspHub.hub.set('test1', Test1)
dspHub.hub.set('test2', Test2)

export {
  dspHub,
}
