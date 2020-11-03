#!/bin/sh

PREFIX_URL='https://noorwachid.github.io/Jar/'

echo '' > index.html
echo '<!DOCTYPE html>' >> index.html
echo '<html>' >> index.html
echo '<head>' >> index.html
echo '    <meta charset="utf-8">' >> index.html
echo '    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">' >> index.html
echo '    <title>Matter</title>' >> index.html
echo '    <link rel="stylesheet" href="style.css">' >> index.html
echo '</head>' >> index.html
echo '<body>' >> index.html
echo '    <header>Jar</header>' >> index.html
echo '    <main>' >> index.html
echo '        <ul>' >> index.html

find . -mindepth 1 -maxdepth 1 -type d -not -path '*.git*' -print0 \
    | sed 's/\.\///g' \
    | xargs -I {} -r0 echo '<li><a href="{}">{}</a></li>' >> index.html

echo '        </ul>' >> index.html
echo '    </main>' >> index.html
echo '</body>' >> index.html
echo '</html>' >> index.html

echo '<?xml version="1.0" encoding="UTF-8"?>' > sitemap.xml
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> sitemap.xml
    find . -mindepth 1 -maxdepth 1 -type d -not -path '*.git*' -print0 \
        | sed 's/\.\///g' \
        | xargs -I {} -r0 echo "<url>\
<loc>$PREFIX_URL{}</loc>\
<lastmod>$(date +%Y-%m-%d)</lastmod>\
</url>" >> sitemap.xml
echo '</urlset>' >> sitemap.xml
