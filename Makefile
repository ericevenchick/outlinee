BUILD_DIR = build
JS_BUILD_DIR = $(BUILD_DIR)/js

JS_SRC = app/js/app.js
JS_SRC += app/js/controllers/OutlineCtrl.js
JS_SRC += app/js/controllers/DropboxCtrl.js
JS_SRC += app/js/directives/Autocomplete.js
JS_SRC += app/js/directives/InputKeyBindings.js
JS_SRC += app/js/directives/ContentEditable.js
JS_SRC += app/js/services/LocalStorageService.js
JS_SRC += app/js/services/DropboxService.js

CSS_SRC_DIR = app/css

# use a timestamp as the build id
BUILD_ID = $(shell echo `date +%s`)

JS_BUILD = $(JS_BUILD_DIR)/outlinee$(BUILD_ID).min.js
HTML_BUILD = $(BUILD_DIR)/index.html $(BUILD_DIR)/about.html

CLOSURE_COMPILE = java -jar util/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS

# build for web
web: $(HTML_BUILD) $(JS_BUILD) $(BUILD_DIR) css
	@echo Done. BUILD_ID = $(BUILD_ID)

# copy html to build dir
$(BUILD_DIR)/%.html: app/%.html | $(BUILD_DIR)
	cp $^ $@

# compile js
$(JS_BUILD): $(JS_SRC) | $(JS_BUILD_DIR)
	$(CLOSURE_COMPILE) --js $(JS_SRC) --js_output_file $(JS_BUILD)

# create the build directories
$(BUILD_DIR):
	mkdir -p $@
$(JS_BUILD_DIR): $(BUILD_DIR)
	mkdir -p $@

# copy all CSS
css: $(BUILD_DIR)
	cp -R $(CSS_SRC_DIR) $(BUILD_DIR)

clean:
	-rm -rf build

deploy:
	s3cmd -P --guess-mime-type sync build/. s3://outlinee.com

.PHONY: clean web deploy css
