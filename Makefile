DEFAULT_BUNDLE_ID=com.simtech.multivendor

# .SILENT:build
.PHONY: change ios android
change:
	@rm -rf android/app/src/main/res/src
	@rm -rf android/app/src/main/res/ios
	@rm -rf android/app/src/main/res/android/mipmap* android/app/src/main/res/android/values
	@find ./ios/csnative/Images.xcassets/AppIcon.appiconset -maxdepth 1 -type f -not -name "Contents.json" -delete
	@find ./ios/csnative/Images.xcassets/LaunchScreen.imageset -maxdepth 1 -type f -not -name "Contents.json" -delete
	@cp -R ./users/${USER}/src ./
	@cp -R ./users/${USER}/ios ./
	@cp -R ./users/${USER}/android ./

build_release_aab:
	@node changeBundleIdAndAppVersion ${BUNDLE_ID} ${APP_VERSION}
	@cd android; \
		./gradlew clean
	@rm -rf node_modules
	@npm i
	@react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
	@rm -rf ./android/app/src/main/res/raw/*
	@rm -rf ./android/app/src/main/res/drawable*

build_debug_apk: build_release_aab
	@cd android; \
		./gradlew assembleDebug

build_release_apk: build_release_aab
	@cd android; \
		./gradlew assembleRelease
