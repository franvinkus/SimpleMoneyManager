package com.simplemoneymanager

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "SimpleMoneyManager"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(
          this,
          mainComponentName,
          // SINTAKS KOTLIN YANG BENAR (tanpa 'get' dan '()')
          DefaultNewArchitectureEntryPoint.fabricEnabled,
          DefaultNewArchitectureEntryPoint.concurrentReactEnabled
      )
  
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
}