(function ($) {
    /**
     *  initialize_field
     *
     *  This function will initialize the $field.
     *
     *  @since   0.0.1-alpha
     */
    function initialize_field($field) {
        $field.find('.rhicomoon-select-field ').each(function () {
            // fonticonpicker initialize
            const selectElement = $(this).fontIconPicker();

            // get the JSON file with icons
            $.ajax({
                url     : rhicomoon.icoMoonJsonFile ? rhicomoon.icoMoonJsonFile : $(this).data('json-url'),
                type    : 'GET',
                dataType: 'json'
            })
                .done(function (response) {
                    console.log(response);

                    // Get the class prefix
                    var classPrefix = response.preferences.fontPref.prefix,
                        icomoon_json_icons = [],
                        icomoon_json_search = [];

                    // For each icon
                    $.each(response.icons, function (i, v) {

                        // Set the source
                        icomoon_json_icons.push(classPrefix + v.properties.name);

                        // Create and set the search source
                        if (v.icon && v.icon.tags && v.icon.tags.length) {
                            icomoon_json_search.push(v.properties.name + ' ' + v.icon.tags.join(' '));
                        } else {
                            icomoon_json_search.push(v.properties.name);
                        }
                    });

                    // Set new fonts on fontIconPicker
                    selectElement.setIcons(icomoon_json_icons, icomoon_json_search);
                })
                .fail(function () {
                    console.log('Error icons not loaded');
                });
        });
    }

    if (typeof acf.add_action !== 'undefined') {
        /*
        *  ready & append (ACF5)
        */
        acf.add_action('ready_field/type=icomoon_select', initialize_field);
        acf.add_action('append_field/type=icomoon_select', initialize_field);
    } else {
        /*
        *  acf/setup_fields (ACF4)
        */
        $(document).on('acf/setup_fields', function (e, postbox) {
            // find all relevant fields
            $(postbox).find('.field[data-field_type="icomoon_select"]').each(function () {
                // initialize
                initialize_field($(this));
            });
        });
    }
})(jQuery);