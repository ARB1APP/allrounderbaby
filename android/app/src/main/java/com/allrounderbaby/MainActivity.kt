package com.allrounderbaby

// import android.app.PictureInPictureParams
// import android.util.Rational
// import android.content.res.Configuration

import android.os.Build
import android.widget.Toast 
import android.os.Bundle
import android.view.WindowManager 
import androidx.annotation.RequiresApi 

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "allrounderbaby"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )
    }


    // @RequiresApi(Build.VERSION_CODES.O)
    // fun enterPiPMode() { ... }

    // @RequiresApi(Build.VERSION_CODES.O)
    // override fun onUserLeaveHint() { ... }

    // private fun shouldEnterPiPOnLeave(): Boolean { ... }

    // @RequiresApi(Build.VERSION_CODES.O)
    // override fun onPictureInPictureModeChanged(isInPictureInPictureMode: Boolean, newConfig: Configuration) { ... }
}