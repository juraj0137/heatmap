function includeJS( jsPath )
{
    var js = document.createElement("script");
    js.setAttribute("type", "text/javascript");
    js.setAttribute("src", jsPath);
    document.getElementsByTagName("head")[0].appendChild(js);
}

//includeJS('http://localhost:63342/bakalarka-heatmap/build/admin/heatmap.min.js');
//includeJS('http://localhost:63342/bakalarka-heatmap/build/client/bundle.js');
//includeJS('http://localhost:63342/bakalarka-heatmap/build/admin/heatmap.min.js');
//includeJS('http://heatmaphub.com/static/bundle.js');
includeJS('http://localhost:8080/static/bundle.js');