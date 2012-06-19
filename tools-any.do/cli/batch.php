<?php
require('jsbeautifier.php');


$opts = new BeautifierOptions();
$opts->indent_size = 1;
$opts->indent_char = "\t";
$opts->indent_with_tabs = true;
$opts->jslint_happy = false;
$opts->keep_array_indentation = true;
$opts->keep_function_indentation = true;
$opts->brace_style = 'collapse';
$opts->preserve_newlines = true;
$opts->max_preserve_newlines = 1;

$jsdirectory = realpath('../js/');
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($jsdirectory),
    RecursiveIteratorIterator::CHILD_FIRST
);


foreach ($iterator as $path) {
    if ($path->isFile()) {
        $filepath = $path->__toString();
        if (preg_match('/(html|libs)/i', $filepath)) {
            continue;
        }
        $beautified = js_beautify(file_get_contents($filepath), $opts);
        file_put_contents($filepath, $beautified);
        echo $filepath, PHP_EOL;
    }
}
