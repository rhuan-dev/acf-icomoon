# ACF IcoMoon Field

A WordPress plugin that adds an IcoMoon icon selector field to Advanced Custom Fields (ACF). This field allows you to easily integrate IcoMoon icons into your ACF fields.

![ACF IcoMoon Field](screenshots/preview.png)

## Features

- 🎯 Easy integration with IcoMoon App
- 🎨 Visual icon picker interface
- 🔍 Search functionality with icon tags
- 💫 Live icon preview
- 🔄 Multiple return formats (class, unicode, or both)
- 🎉 Compatible with ACF Pro 5.0.0 and later
- 🌐 Translation ready

## Requirements

- WordPress 5.8 or later
- PHP 7.4 or later
- Advanced Custom Fields Pro 5.0.0 or later
- IcoMoon selection.json file

## Installation

1. Download the plugin
2. Upload the plugin files to the `/wp-content/plugins/acf-icomoon` directory
3. Activate the plugin through the 'Plugins' screen in WordPress
4. Make sure you have Advanced Custom Fields Pro installed and activated

## Usage

### 1. Generate IcoMoon Package

1. Go to [IcoMoon App](https://icomoon.io/app)
2. Select or import your icons
3. Click "Generate Font"
4. Download the package
5. Upload the `selection.json` file and font files to your theme/plugin

### 2. Add Font Files

Add the IcoMoon font files and CSS to your theme:

```php
// In your theme's functions.php
function theme_enqueue_icomoon() {
    wp_enqueue_style(
        'icomoon',
        get_template_directory_uri() . '/path/to/style.css'
    );
}
add_action('wp_enqueue_scripts', 'theme_enqueue_icomoon');
```

### 3. Configure the Field

#### Using ACF UI

1. Create a new field
2. Select "IcoMoon" as field type
3. Configure the field settings:
   - Enter the URL to your `selection.json` file
   - Choose return format (class, unicode, or both)
   - Set placeholder text
   - Enable/disable null value

#### Using PHP

```php
acf_add_local_field([
    'key' => 'field_icomoon',
    'label' => 'Icon',
    'name' => 'icon',
    'type' => 'icomoon_select',
    'json_url' => 'https://your-domain.com/path/to/selection.json',
    'allow_null' => true,
    'return_format' => 'both', // 'class', 'unicode', or 'both'
    'placeholder' => 'Select an icon'
]);
```

### 4. Using the Field Value

```php
// Get icon class
$icon_class = get_field('icon');
echo '<i class="' . esc_attr($icon_class) . '"></i>';

// Get unicode value
$icon_unicode = get_field('icon', false, false, ['return_format' => 'unicode']);
echo '<span style="font-family: icomoon">' . $icon_unicode . '</span>';

// Get both formats
$icon = get_field('icon', false, false, ['return_format' => 'both']);
echo '<i class="' . esc_attr($icon['class']) . '" data-unicode="' . esc_attr($icon['unicode']) . '"></i>';
```

## Filters

The plugin provides several filters for customization:

```php
// Change the default JSON URL
add_filter('rhicomoon_json_url', function() {
    return 'https://your-domain.com/path/to/selection.json';
});

// Modify assets URL
add_filter('rhicomoon_assets_url', function($url) {
    return $url;
});
```

## Development

### Requirements

- Node.js 14 or later
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Available commands:
```bash
npm run build   # Build assets for production
npm run dev     # Start development server
npm run watch   # Watch for changes
```

### File Structure

```
acf-icomoon/
├── assets/
│   ├── js/
│   │   └── select-icon.js
│   └── sass/
│       └── style.scss
├── fields/
│   ├── acf-field-icomoon-select-v4.php
│   └── acf-field-icomoon-select-v5.php
├── lang/
├── ACFIcoMoonPlugin.php
├── gulpfile.js
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## Credits

- Created by [Rhuan Carlos](https://rhuan.dev)
- Uses [jQuery FontIconPicker](https://github.com/fontIconPicker/fontIconPicker)

## Support

If you find a bug or have a feature request, please [open an issue](https://github.com/rhcarlosweb/acf-icomoon/issues).