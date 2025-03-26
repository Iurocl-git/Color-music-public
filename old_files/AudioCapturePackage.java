package expo.modules.audiocapture;

// import com.facebook.react.ReactPackage;
// import com.facebook.react.bridge.NativeModule;
// import com.facebook.react.bridge.ReactApplicationContext;
//
// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.List;
//
// import com.facebook.react.uimanager.ViewManager;
//
// public class AudioCapturePackage implements ReactPackage {
//
//    @Override
//    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
//        List<NativeModule> modules = new ArrayList<>();
//        modules.add(new AudioCaptureModule(reactContext));
//        return modules;
//    }
//
//    @Override
//    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
//        return Collections.emptyList();
//    }
// }

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;

import android.content.Context;

import java.util.Collections;
import java.util.List;

public class AudioCapturePackage implements ReactPackage {
  @Override
  public List<NativeModule> createNativeModules(
      com.facebook.react.bridge.ReactApplicationContext reactContext) {
    return List.of(new AudioCaptureModule(reactContext));
  }

  @Override
  public List<ViewManager> createViewManagers(
      com.facebook.react.bridge.ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
