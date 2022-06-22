/**
 * This is an extension for converter 
 */

/////////////////////////////////////////////////////////////////
// Corpus converter related variables
/////////////////////////////////////////////////////////////////
Object.assign(app_hotpot.vpp_data, {
    converter_corpus_task: 'medtagger',

    // for medtagger
    converter_corpus_medtagger_txt_files: [],
    converter_corpus_medtagger_ann_files: [],
    converter_corpus_medtagger_results: []
});

/////////////////////////////////////////////////////////////////
// Corpus converter related functions
/////////////////////////////////////////////////////////////////

Object.assign(app_hotpot, {
    // events for loading text files
    bind_dropzone_converter_medtagger_txt: function() {
        let filelist_dropzone = document.getElementById('mui_converter_medtagger_txt_filelist');
        filelist_dropzone.addEventListener("dragover", function(event) {
            event.preventDefault();
        }, false);

        filelist_dropzone.addEventListener(
            "drop", 
            app_hotpot.on_drop_converter_medtagger_txt, 
            false
        );
    },

    // callback for loading text files
    on_drop_converter_medtagger_txt: function(event) {
        // prevent the default download event
        event.preventDefault();

        // prevent other event
        if (event.srcElement.nodeName.toLocaleUpperCase() != 'DIV') {
            return;
        }

        let items = event.dataTransfer.items;
        for (let i=0; i<items.length; i++) {
            if (isFSA_API_OK) {
                // get this item as a FileSystemHandle Object
                // this could be used for saving the content back
                // let item = items[i].webkitGetAsEntry();
                let item = items[i].getAsFileSystemHandle();

                // read this handle
                item.then(function(fh) {
                    if (fh.kind == 'file') {
                        app_hotpot.parse_file_fh(
                            fh, 
                            function(file) {
                                app_hotpot.vpp.$data.converter_corpus_medtagger_txt_files.push(file);
                            } 
                        );


                    } else {
                        // so item is a directory?
                        fs_read_dir_handle(
                            fh, 
                            app_hotpot.vpp.$data.dtd
                        );
                    }
                });
            } else {
                // do nothing without
                console.log('* no FSA API');
                return;
            }
            
        }
    },


    // events for loading ann files
    bind_dropzone_converter_medtagger_ann: function() {
        let filelist_dropzone = document.getElementById('mui_converter_medtagger_ann_filelist');
        filelist_dropzone.addEventListener("dragover", function(event) {
            event.preventDefault();
        }, false);

        filelist_dropzone.addEventListener(
            "drop", 
            app_hotpot.on_drop_converter_medtagger_ann, 
            false
        );
    },

    // callback for loading ann files
    on_drop_converter_medtagger_ann: function(event) {
        // prevent the default download event
        event.preventDefault();

        // prevent other event
        if (event.srcElement.nodeName.toLocaleUpperCase() != 'DIV') {
            return;
        }

        let items = event.dataTransfer.items;
        for (let i=0; i<items.length; i++) {
            if (isFSA_API_OK) {
                // get this item as a FileSystemHandle Object
                // this could be used for saving the content back
                // let item = items[i].webkitGetAsEntry();
                let item = items[i].getAsFileSystemHandle();

                // read this handle
                item.then(function(fh) {
                    if (fh.kind == 'file') {
                        app_hotpot.parse_file_fh(
                            fh, 
                            function(file) {
                                // for ann, we need the lines
                                file.text = file.text.trim();
                                file.lines = file.text.split('\n');

                                // save this 
                                app_hotpot.vpp.$data.converter_corpus_medtagger_ann_files.push(file);
                            } 
                        );


                    } else {
                        // so item is a directory?
                        fs_read_dir_handle(
                            fh, 
                            app_hotpot.vpp.$data.dtd
                        );
                    }
                });
            } else {
                // do nothing without
                console.log('* no FSA API');
                return;
            }
            
        }
    }
});


Object.assign(app_hotpot.vpp_methods, {
    switch_corpus: function(corpus_task) {
        this.converter_corpus_task = corpus_task;
    },

    clear_converter_corpus_all: function() {
        // remove the medtagger files
        this.converter_corpus_medtagger_txt_files = [];
        this.converter_corpus_medtagger_ann_files = [];
        this.converter_corpus_medtagger_results = [];
    },

    convert_from_medtagger_txt_and_ann: function() {
        this.converter_corpus_medtagger_results = medtagger_toolkit.convert_medtagger_files_to_anns(
            this.converter_corpus_medtagger_txt_files,
            this.converter_corpus_medtagger_ann_files,
            this.dtd
        );
    }
});