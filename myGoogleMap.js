
/**
 *
 *  $ JavaScript Library for GoogleMapAPI v3 $
 *  $ for 'GoogleMapAPI version 3.26'        $
 *
 */


//===========================================
// GoogleMap用グローバル変数の宣言
//===========================================
//{
    // GoogleMapインスタンス用変数
    var map;

    // ズームレベル変更のイベントリスナー
    var zoomChanged_listener;

    // 表示倍率変数
    var z = 11;

    // GoogleMap高さ変更用
    var center;

    // アイコンフラグ
    var icon, icon_shadow;

    // マーカー配列用
    var Markers;

    // タイマーID
    var timerID;

    // Polygon変数
    var poly;
//}


//===========================================
// 初期座標設定（クラス）
//===========================================
//{
    var default_location = { //世界測地系
        lat : 35.658582050535614,
        lng : 139.74543124437332,
    };
//}


//===========================================
// SankiGoogleMapクラス
//===========================================
//{
    // GoogleMap Property
    //{
        var myOptions = {
            center: new google.maps.LatLng(default_location.lat, default_location.lng),
            disableDoubleClickZoom: true,
            draggable: true,
            mapTypeControl: true,
            //mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DEFAULT}, // DEFAULT,HORIZONTAL_BAR,DROPDOWN_MENU
            mapTypeId: google.maps.MapTypeId.ROADMAP, // ROADMAP,SATELLITE,HYBRID,TERRAIN
            streetViewControl: false,
            navigationControl: true,
            //navigationControlOptions: {style: google.maps.NavigationControlStyle.DEFAULT}, // DEFAULT,SMALL,ANDROID,ZOOM_PAN
            scaleControl: true,
            //scaleControlOptions: {style: google.maps.ScaleControlStyle.STANDARD},
            scrollwheel: false,
            zoomControl: true,
            zoom: z,
            maxzoom: 21,          //カスタム追加（拡大の最大値：0～21（実際には20まで））
            metric: false,        //カスタム追加（世界測地系に変換するか）
            addMarkers: false,    //カスタム追加（クリックしてマーカーを追加するかどうか）
            adjustMarkers: false, //カスタム追加（近接するマーカーを位置調整するかどうか）
            adjustBounds: false,  //カスタム追加（全てのマーカーが表示されるように自動調節するかどうか）
        };
    //}

    // Marker Property
    //{
        var markerOptions = {
            title: null,
            icon: null,
            shadow: null,
            draggable: false,
            crossOnDrag: true,          //ドラッグ中の十字マーク表示
            //animation: google.maps.Animation.DROP, //(BOUNCE|DROP) //ドロップ時の挙動
            enableDelete: false,        //カスタム追加（マーカークリックで削除するか）
            enableInfoWindow: false,    //カスタム追加（情報ウィンドウを表示するか）
        };
    //}

    // Route Request Property
    //{
        var requestOptions = {
            origin: null,       //出発地点
            destination: null,  //到着地点
            travelMode: google.maps.DirectionsTravelMode.DRIVING, //DRIVING=自動車,BICYCLING=自転車,TRANSIT=電車,WALKING=徒歩
        };
    //}

    var myGoogleMap = {

        id: "",

        // GoogleMap 表示関数
        //{
            makeGMap: function()
            {
                // Internet Explorer 5.5 is Not Available
                if(navigator.userAgent.indexOf("MSIE 5.5") != -1) {
                    return null;
                }

                myOptions.draggableCursor = null;
                myOptions.draggingCursor  = null;

                //GoogleMapインスタンスを生成(v3)
                map = new google.maps.Map(document.getElementById(this.id), myOptions);

                // マーカー配列の初期化
                Markers = new Array();

                //icon          = this.makeIcon();
                //icon_shadow   = this.makeIconShadow();

                this.addEvent();
            },
        //}

        // イベントの追加
        //{
            addEvent: function()
            {
                // divリサイズ時mapイベント
                // リサイズ時にも中心点をキープする
                google.maps.event.clearListeners(map, "resize");
                google.maps.event.addListener(map, "resize", function(LatLng)
                {
                    if(LatLng != null) map.setCenter(LatLng, myOptions.zoom);
                });

                // divリサイズ時mapイベントのトリガー
                document.getElementById("map").onresize = function()
                {
                    var LatLng = map.getCenter();
                    google.maps.event.trigger(map, "resize", LatLng);
                }

                google.maps.event.clearListeners(map, "click");
                google.maps.event.addListener(map, "click", function(e)
                {
                    if(myOptions.addMarkers) {

                        if(e) {
                            myGoogleMap.createMarker(e.latLng.lat(), e.latLng.lng(), false);
                        }
                    }
                });

                google.maps.event.clearListeners(map, "dblclick");
                google.maps.event.addListener(map, "dblclick", function(e)
                {
                    // code
                });

                google.maps.event.clearListeners(map, "center_changed");
                google.maps.event.addListener(map, "center_changed", function()
                {
                    // code
                });

                google.maps.event.clearListeners(map, "bounds_changed");
                google.maps.event.addListener(map, "bounds_changed", function()
                {

                    // 表示領域を生成します。
                    var bounds = map.getBounds();

                    //マーカーが境界内に含まれるかどうかで表示・非表示を切り替え
                    for(mark in Markers) {

                        if(bounds.contains(Markers[mark].position)) {
                            Markers[mark].setMap(map);
                        } else {
                            Markers[mark].setMap(null);
                        }

                    }

                });

                google.maps.event.removeListener(zoomChanged_listener);
                zoomChanged_listener = google.maps.event.addListener(map, "zoom_changed", function()
                {
                    var z = map.getZoom();

                    if(z > myOptions.maxzoom) {
                        map.setZoom(myOptions.maxzoom);
                        alert("これ以上拡大できません。");
                    }
                });

            },
        //}

        // ズームメソッド
        //{
            myZoomIn: function()
            {
                map.setZoom(map.getZoom() + 1);
            },

            myZoomOut: function()
            {
                map.setZoom(map.getZoom() - 1);
            },
        //}


        // アイコン作成メソッド
        //{
            // 実体
            makeIcon: function()
            {
                var icon = new google.maps.MarkerImage(
                    "./images/gicon.png",
                    new google.maps.Size( 30, 36 ),
                    new google.maps.Point( 0, 0 ),
                    new google.maps.Point( 15, 36 )
                );
                return icon;
            },
            // 影
            makeIconShadow: function()
            {
                var icon = new google.maps.MarkerImage(
                    "./images/gicon_shadow.png",
                    new google.maps.Size( 32, 33 ),
                    new google.maps.Point( 0, 0 ),
                    new google.maps.Point( 0, 33 )
                );
                return icon;
            },
            // 数字アイコン
            makeNumIcon: function(n)
            {
                var icon = new google.maps.MarkerImage("//chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+ (n + 1) + "|ff7e73|000000");
                return icon;
            },
            // 数字アイコン影
            makeNumIconShadow: function()
            {
                var icon = new google.maps.MarkerImage("//chart.apis.google.com/chart?chst=d_map_pin_shadow", null, null, new google.maps.Point(12, 35) );
                return icon;
            },
        //}


        // GoogleMap ポイント表示関数（住所から）
        //{
            showAddress: function(addr)
            {
                var geocoder = new google.maps.Geocoder();
                addr = decodeURI(addr);

                if(geocoder) {

                    geocoder.geocode(
                        {address: addr},
                        function(geo_result, geo_response)
                        {
                            if(geo_response == "OK") {
                                var myMetric = myOptions.metric;
                                myOptions.metric = false;
                                myGoogleMap.createMarker(geo_result[0].geometry.location.lat(), geo_result[0].geometry.location.lng(), true);
                                myOptions.metric = myMetric;
                            } else {
                                //alert(geo_response);
                                alert("「" + addr + "」が見つかりませんでした。");
                            }
                        }

                );}
            },
        //}

        // 座標から住所を取得
        //{
            geocodeAddress: "",
            cnvCoord2Address: function(location)
            {
                var geocoder = new google.maps.Geocoder();

                if(geocoder) {

                    geocoder.geocode(
                        {location: location},
                        function(geo_result, geo_response)
                        {
                            if(geo_response == "OK") {

                                var tmpadd = "";
                                tmpadd = geo_result[0].formatted_address.replace("日本, ", "");

                                myGoogleMap.geocodeAddress = tmpadd;

                            } else {
                                //alert(geo_response + "\n\n変換できませんでした。");
                                myGoogleMap.geocodeAddress = geo_response + "\n\n変換できませんでした。";

                            }
                        }

                );}

            },
        //}


        // GoogleMap ポイント表示関数（座標から）
        //{
            createMarker: function(lat, lng, toCenter)
            {
                // 世界測地系に変換
                if(myOptions.metric) {
                    var obj = this.cnvCoords(lat, lng, true);
                    lat = obj.lat;
                    lng = obj.lng;
                }

                targetPoint = new google.maps.LatLng(lat, lng);

                markerOptions.map = map;
                markerOptions.position = targetPoint;
                markerOptions.icon = icon;
                markerOptions.shadow = icon_shadow;

                var marker = new google.maps.Marker(markerOptions);

                // グローバル配列にマーカーを追加
                var i = Markers.push(marker);
                i--;

                if(markerOptions.enableDelete) {

                    google.maps.event.addListener(marker, "click", function(e)
                    {
                        marker.setMap(null); //マーカーの削除
                        Markers.splice(i, 1);

                        // 情報ウィンドウの表示
                        //var iwOptions = {
                        //    content: "test"
                        //};
                        //var infoWindow = new google.maps.InfoWindow(iwOptions);
                        //infoWindow.open(map, marker);
                    });

                }

                if(toCenter) map.setCenter(targetPoint, myOptions.zoom);
            },
        //}


        // 緯度・経度日本測地系・世界測地系(WGS84)ｎ相互変換
        //{
            cnvCoords: function(lat, lng, metric)
            {
                if(metric) {
                    // 世界測地系に変換
                    lat = lat - lat * 0.00010695  + lng * 0.000017464 + 0.0046017;
                    lng = lng - lat * 0.000046038 - lng * 0.000083043 + 0.010040;
                } else {
                    // 日本測地系に変換
                    lat = lat + lat * 0.00010695  - lng * 0.000017464 - 0.0046017;
                    lng = lng + lat * 0.000046038 + lng * 0.000083043 - 0.010040;
                }

                var obj = new Object();
                obj.lat = lat;
                obj.lng = lng;

                return obj;
            },
        //}


        // 座標変換関数
        //{
            calc: function(data)
            {
                var d     = Math.round(data * 360000);
                var dosu  = Math.floor(d / 360000);
                var min   = Math.floor(d / 6000) % 60;
                var sec   = Math.floor(d / 100) % 60;
                var amari = d % 100;
                return dosu + '度' + min + '分' + sec + '.' + amari + '秒' + '[' + data + ']';
            },
        //}


        // 200m範囲内に近接するポイントを離す
        //{
            adjustInterval: function()
            {
                var f = false; // ループ用のフラグ

                // Markers: Array   マーカーポイントを格納した配列
                // mark:    integer マーカーポイントのインデックス

                for(mark in Markers) {

                    var m      = Markers[mark].position; // [mark]番目の座標を取得
                    var radius = this.calcScope();       // 座標範囲の算出

                    // [mark]番目のポイントを中心とした矩形領域を作成
                    // （緯度経度は北東にいくほど値が大きくなる）
                    //{
                        // 南西の隅
                        var sw = new google.maps.LatLng(m.lat() - radius[0], m.lng() - radius[1]);
                        // 北東の隅
                        var ne = new google.maps.LatLng(m.lat() + radius[0], m.lng() + radius[1]);

                        var llB = new google.maps.LatLngBounds(sw, ne);
                    //}

                    // 他のポイントが境界内に含まれるか
                    //{
                        for(ma in Markers) {

                            if(mark != ma) {

                                if(llB.contains(Markers[ma].position)) { // 境界内に含まれる

                                    var n = Markers[ma].position;
                                    var toLatLng = new google.maps.LatLng(m.lat() + (m.lat() - n.lat()), m.lng() + (m.lng() - n.lng()));

                                    Markers[mark].setPosition(toLatLng);

                                    f = true; // ループさせるため、フラグを立てる

                                }

                            }

                        }
                    //}
                }

                // フラグがtrueのとき、再起呼び出し
                //{
                    if(f) {

                        timerID = setTimeout("myGoogleMap.adjustInterval()", 100);

                    } else {

                        clearTimeout(timerID); // 終了させる

                        if(Markers.length > 1) {
                            var coords = this.getAverage();
                            map.setCenter(new google.maps.LatLng(coords.lat, coords.lng), map.getZoom());
                        }

                    }
                //}
            },
        //}


        // マーカー達の平均緯度経度の算出
        //{
            getAverage: function()
            {
                var lngLat = 0; // 緯度加算用
                var lngLng = 0; // 経度加算用

                // Markers: Array   マーカーポイントを格納した配列
                // mark:    integer マーカーポイントのインデックス

                for(mark in Markers) {
                    var m = Markers[mark].position; // [mark]番目の座標を取得

                    lngLat += m.lat();
                    lngLng += m.lng();
                }

                lngLat /= Markers.length;
                lngLng /= Markers.length;

                var obj = new Object();
                obj.lat = lngLat;
                obj.lng = lngLng;

                return obj;
            },
        //}


        // 座標範囲の算出
        //{
            calcScope: function()
            {
                // 座標にて周辺の物件を探す場合の半径（km）
                var radius = 0.2;

                // 緯度1秒の平均距離 約30.9m
                // 緯度35度上の緯度1秒の距離 約30.8m
                //{
                    var lat_length = 30.9;
                //}

                // 緯度35度上の経度1秒の距離 約25m
                //{
                    var lng_length = 25;
                //}

                var rad = radius * 1000; // 半径をm単位に変換

                var lat_scope = (rad / lat_length) / 3600;
                var lng_scope = (rad / lng_length) / 3600;


                var scope = new Array();
                scope[0] = lat_scope;
                scope[1] = lng_scope;

                return scope;
            },
        //}


        // 地図表示領域をマーカー位置に合わせて拡大
        //{
            adjustBounds: function()
            {
                // マーカー1つ以下なら実行しない
                if(Markers.length <= 1) {
                    return;
                }

                // 表示領域を生成します。
                var bounds = new google.maps.LatLngBounds();

                // Markers: Array   マーカーポイントを格納した配列
                // mark:    integer マーカーポイントのインデックス

                // 領域に全てのマーカー座標を追加
                for(mark in Markers) {
                    bounds.extend (Markers[mark].position);
                }

                // 地図表示領域の変更を反映します。
                map.fitBounds (bounds);
            },
        //}


        // ルート表示
        //{
            DispRoute: function(startSpot)
            {
                var directionsService = new google.maps.DirectionsService();

                requestOptions.origin = startSpot;

                directionsDisplay = new google.maps.DirectionsRenderer({
                    "map": map,
                    "preserveViewport": true, //現在のビューを保持する
                    "draggable": true
                });

                directionsService.route(requestOptions, function(response, status) {

                    if (status == google.maps.DirectionsStatus.OK) {

                        directionsDisplay.setDirections(response);

                        currentDirections = directionsDisplay.getDirections();
                        var route = currentDirections.routes[0];
                        var s = "";

                        for(var i = 0; i < route.legs.length; i++) {
                            s += route.legs[i].start_address + "から";
                            s += route.legs[i].end_address + "まで\n";
                            s += "距離：" + route.legs[i].distance.text + "\n";
                            s += "かかる時間は約" + route.legs[i].duration.text + "です。";
                        }

                        alert(s);

                    }

                });
            },
        //}


        // 距離計算
        //{
            calcLength: function(startSpot, endSpot)
            {
                var distance = 0;
                var directionsService = new google.maps.DirectionsService();

                requestOptions.origin = startSpot;
                requestOptions.destination = endSpot;

                directionsDisplay = new google.maps.DirectionsRenderer({
                    "map": map,
                    "preserveViewport": true, //現在のビューを保持する
                    "draggable": true
                });

                directionsService.route(requestOptions, function(response, status) {

                    if (status == google.maps.DirectionsStatus.OK) {

                        directionsDisplay.setDirections(response);

                        currentDirections = directionsDisplay.getDirections();
                        var route=currentDirections.routes[0];

                        for(var i = 0; i < route.legs.length; i++) {
                            distance = route.legs[i].distance.text;
                            alert(distance);
                        }

                    }

                });

            },
        //}

        // 海抜取得
        //{
            getElevation: function(location, id)
            {
                var request = {locations: new Array(location)};

                var myElevation = new google.maps.ElevationService();

                myElevation.getElevationForLocations(request, function(response, status) {

                    if(status == google.maps.ElevationStatus.OK) {
                        var r = Math.round(response[0].elevation * 100) / 100;
                        document.getElementById(id).value = r + "m";
                    } else {
                        document.getElementById(id).value = "取得できませんでした。";
                    }

                });
            },
        //}

    }
//}


//===========================================
// Polygonクラス
//===========================================
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
    }

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

