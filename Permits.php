<?php

$folders = [
    "/home/mmlcir/wenodes/about",
    "/home/mmlcir/wenodes/fonts",
    "/home/mmlcir/wenodes/images",
    "/home/mmlcir/wenodes/join",
    "/home/mmlcir/wenodes/team",
    "/home/mmlcir/wenodes/work",
    "/home/mmlcir/wenodes/works"
];


function fixPermissions($path)
{
    if (!file_exists($path)) {
        echo "❌ NOT FOUND: $path<br>";
        return;
    }


    if (is_dir($path)) {

        chmod($path, 0755);

        echo "📁 FOLDER: $path → 755<br>";

        $items = scandir($path);

        foreach ($items as $item) {

            if ($item === "." || $item === "..") {
                continue;
            }

            fixPermissions($path . DIRECTORY_SEPARATOR . $item);
        }

    } else {

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        $allowed = [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "svg",
            "gif",
            "woff",
            "woff2",
            "ttf",
            "otf",
            "mp4"
        ];

        if (in_array($ext, $allowed)) {
            echo "🖼️ FOUND $ext FILE: $path<br>";
        } else {
            echo "📄 FILE: $path<br>";
        }


        chmod($path, 0644);

    }
}


foreach ($folders as $folder) {

    echo "<hr>";
    echo "START: $folder<br>";
    echo "<hr>";

    fixPermissions($folder);
}


echo "<br><b>DONE</b>";

?>