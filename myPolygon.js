
/**
 *
 *  $ JavaScript Library for GoogleMapAPI v3 $
 *  $ for 'GoogleMapAPI version 3.26'        $
 *
 */


//===========================================
// GoogleMap Polygon用グローバル変数の宣言
//===========================================
//{
    // Polygon変数
    var poly;
//}


//===========================================
// Polygonクラス
//===========================================
//{
	// Polygon Property
	//{
	    var myPolygonOptions = {
	        clickable: false,
	        fillColor: "#ffffff",   // 塗り潰し色
	        fillOpacity: 0.6,       // 塗り潰しの不透明度（0.0-1.0）
	        map: map,               // GoogleMapのインスタンス
	        paths: new Array(),     // 座標の配列
	        strokeColor: "#000000", // 線の色
	        strokeOpacity: 0.8,     // 線の不透明度（0.0-1.0）
	        strokeWeight: 3         // 線の太さ（ピクセル）
	    };
	//}

    var myPolygon = {

        area_id: "",
        area_tubo_id: "",
        distance_id: "",

        make: function(area_id, area_tubo_id, distance_id)
        {
            if(area_id == null || area_id == "") area_id = "area";
            if(area_tubo_id == null || area_tubo_id == "") area_tubo_id = "area_tubo";
            if(distance_id == null || distance_id == "") distance_id = "distance";

            this.area_id      = area_id;
            this.area_tubo_id = area_tubo_id;
            this.distance_id  = distance_id;

            poly = new google.maps.Polygon(myPolygonOptions);

            // マウスカーソルを矢印に設定
            myOptions.draggableCursor = "default";
            myOptions.draggingCursor  = "default";
            map.setOptions( { draggableCursor: "default", draggingCursor: "default" } );

            // マップのクリックイベントに図形描画
            google.maps.event.addListener(map, "click", function(e)
            {
                if(e) {

                    myPolygonOptions.paths.push(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));

                    poly.setPaths(myPolygonOptions.paths);
                    poly.setMap(map);

                    // 面積計測のための図形座標の配列を別途作成
                    // 別に作成しないと続きを描画できない（計測するには図形を閉じないといけないため）
                    var thisPoly = new Array();
                    for(var i = 0; i < myPolygonOptions.paths.length; i++) {
                        thisPoly.push(myPolygonOptions.paths[i]);
                    }

                    // 面積を計測するには図形が閉じている必要があるので、最後に開始点を追加
                    thisPoly.push(myPolygonOptions.paths[0]);

                    // 面積を計測し、小数点以下2位で切り上げ
                    var a = google.maps.geometry.spherical.computeArea(thisPoly);
                    a *= 100;
                    a = Math.ceil(a);
                    a /= 100;

                    document.getElementById(myPolygon.area_id).value = a;

                    // 面積を坪数に変換し、小数点以下2位で切り上げ
                    var tubo = a * 0.3025;
                    tubo *= 100;
                    tubo = Math.ceil(tubo);
                    tubo /= 100;

                    document.getElementById(myPolygon.area_tubo_id).value = tubo;

                    if(myPolygonOptions.paths.length > 1) {
                        // 最終点から1つ前の座標
                        var from = myPolygonOptions.paths[myPolygonOptions.paths.length - 2];
                        // 最終点の座標
                        var to   = myPolygonOptions.paths[myPolygonOptions.paths.length - 1];
                        // 2点間の距離を計測
                        var d = google.maps.geometry.spherical.computeDistanceBetween(from, to);
                        // 距離を小数点以下2位で切り上げ
                        d *= 100;
                        d = Math.ceil(d);
                        d /= 100;

                        if(d > 1) {
                            document.getElementById(myPolygon.distance_id).value = d;
                        }
                    }

                }
            });

            google.maps.event.addListener(map, "bounds_changed", function()
            {

                // 表示領域を生成します。
                var bounds = map.getBounds();

                //ポリゴンが境界内に含まれるかどうかで表示・非表示を切り替え
                var pBounds = new google.maps.LatLngBounds();
                var myPoly = poly.getPaths();

                myPoly.forEach( function( value, index, array) {
                    value.forEach( function( val ) {
                        pBounds.extend(val);
                    });
                });

                if(bounds.intersects(pBounds)) {
                    poly.setMap(map);
                } else {
                    poly.setMap(null);
                }

            });

        },

        clear: function()
        {
            // 描画した図形の削除
            myPolygonOptions.paths = new Array();
            poly.setPaths(new Array());
            poly.setMap(map);

            document.getElementById(myPolygon.area_id).value = "";
            document.getElementById(myPolygon.area_tubo_id).value = "";
            document.getElementById(myPolygon.distance_id).value = "";
        },

        destroy: function()
        {
            this.clear();

            // マウスカーソルを元に戻す
            myOptions.draggableCursor = null;
            myOptions.draggingCursor  = null;
            map.setOptions( { draggableCursor: null, draggingCursor: null } );

            // マップのクリックイベントを再構成
            myGoogleMap.addEvent();
        },

    }
//}
