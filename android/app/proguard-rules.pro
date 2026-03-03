############################################################
# Project specific ProGuard rules
############################################################

############################################################
# VdoCipher / Media3 Rule (Prevents removal of MediaLibraryInfo)
############################################################
-keep class androidx.media3.common.MediaLibraryInfo { *; }

############################################################
# VdoCipher (VERY IMPORTANT)
############################################################
-keep class com.vdocipher.** { *; }
-dontwarn com.vdocipher.**

############################################################
# ExoPlayer (Used internally by VdoCipher)
############################################################
-keep class com.google.android.exoplayer2.** { *; }
-dontwarn com.google.android.exoplayer2.**

############################################################
# AndroidX Media3 (New ExoPlayer namespace)
############################################################
-keep class androidx.media3.** { *; }
-dontwarn androidx.media3.**

############################################################
# React Native Bridge
############################################################
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

############################################################
# OkHttp (Networking layer)
############################################################
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**

############################################################
# Kotlin Metadata
############################################################
-keep class kotlin.Metadata { *; }

############################################################
# Prevent removal of annotations
############################################################
-keepattributes *Annotation*

############################################################
# Keep native methods
############################################################
-keepclasseswithmembernames class * {
    native <methods>;
}