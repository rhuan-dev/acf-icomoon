/**
 * ACF IcoMoon Field
 * 
 * @since 0.0.1-alpha
 */
(($) => {
    'use strict';

    /**
     * Initialize the icon picker field.
     *
     * @param {jQuery} $field The field element.
     */
    const initializeField = ($field) => {
        const $select = $field.find('.rhicomoon-select-field');
        const $preview = $field.find('.acf-icomoon-preview');

        if (!$select.length) {
            return;
        }

        // Initialize FontIconPicker with options
        const picker = $select.fontIconPicker({
            theme: 'fip-grey',
            iconsPerPage: 20,
            emptyIcon: true,
            emptyIconValue: '',
            appendTo: 'self',
            allCategoryText: 'From: ',
            searchPlaceholder: rhicomoon.i18n?.loading || 'Loading icons...'
        }).data('fontIconPicker');

        // Show loading state
        $preview.html(`<span class="acf-icon -loading"></span> ${rhicomoon.i18n?.loading || 'Loading icons...'}`);

        // Get the JSON file URL
        const jsonUrl = rhicomoon.icoMoonJsonFile || $select.data('json-url');

        if (!jsonUrl) {
            console.error('No IcoMoon JSON URL provided');
            $preview.html(`<span class="acf-icon -warning"></span> ${rhicomoon.i18n?.error_loading || 'Error loading icons'}`);
            return;
        }

        // Fetch and process icons
        $.ajax({
            url: jsonUrl,
            type: 'GET',
            dataType: 'json',
            cache: true
        })
        .done((response) => {
            try {
                if (!response?.icons?.length || !response?.preferences?.fontPref?.prefix) {
                    throw new Error('Invalid IcoMoon JSON format');
                }

                const classPrefix = response.preferences.fontPref.prefix;
                const icons = [];
                const searchTerms = [];

                // Process each icon
                response.icons.forEach((icon) => {
                    const name = classPrefix + icon.properties.name;
                    icons.push(name);

                    // Build search terms
                    const terms = [icon.properties.name];
                    if (icon.icon?.tags?.length) {
                        terms.push(...icon.icon.tags);
                    }
                    searchTerms.push(terms.join(' '));
                });

                // Update picker with icons
                picker.setIcons(icons, searchTerms);
                
                // Clear loading state
                $preview.empty();

                // Update placeholder
                picker.refreshPlaceholder($select.data('placeholder'));

                // Trigger change event to update preview if there's a value
                if ($select.val()) {
                    $select.trigger('change');
                }
            } catch (error) {
                console.error('Error processing icons:', error);
                $preview.html(`<span class="acf-icon -warning"></span> ${rhicomoon.i18n?.error_loading || 'Error loading icons'}`);
            }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error('Error loading icons:', textStatus, errorThrown);
            $preview.html(`<span class="acf-icon -warning"></span> ${rhicomoon.i18n?.error_loading || 'Error loading icons'}`);
        });

        // Handle icon selection change
        $select.on('change', function() {
            const value = $(this).val();
            if (value) {
                $preview.html(`<i class="${value}"></i> <code>${value}</code>`);
            } else {
                $preview.empty();
            }
        });
    };

    // Register field initialization for ACF 5+
    if (typeof acf.addAction !== 'undefined') {
        acf.addAction('ready_field/type=icomoon_select', initializeField);
        acf.addAction('append_field/type=icomoon_select', initializeField);
    } else {
        // Legacy support for ACF 4
        $(document).on('acf/setup_fields', function(e, postbox) {
            $(postbox).find('.field[data-field_type="icomoon_select"]').each(function() {
                initializeField($(this));
            });
        });
    }
})(jQuery);