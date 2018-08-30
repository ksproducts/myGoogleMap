myGoogleMap
====

# Overview
Google Maps JavaScript APIを利用しやすいようにメソッドやプロパティを定義したクラスライブラリ

## Install
ダウンロードしてHTMLに読み込んでください。
* [Download Zip](https://github.com/ksproducts/myGoogleMap/archive/master.zip)

## Requirement
* Google Maps JavaScript API v3+

## Usage

### myGoogleMap
```javascript
// 初期状態の座標を指定する
myGoogleMap.default_location.lat = 35.658582050535614;
myGoogleMap.default_location.lng = 139.74543124437332;

myGoogleMap.make('map'); 引数：マップを表示するHTMLタグID
```
読み込みが完了している状態で地図を移動させる
引数：緯度, 経度
```javascript
myGoogleMap.go(35.658582050535614, 139.74543124437332);
```
アニメーションさせる場合
引数：緯度, 経度
```javascript
myGoogleMap.move(35.658582050535614, 139.74543124437332);
```

マーカーを追加する
引数：緯度, 経度, 地図の中心を指定した座標に移動するか（true|false）
```javascript
myGoogleMap.marker.add(35.658582050535614, 139.74543124437332, true);
```

ポリラインを追加する
引数：座標配列の配列
```javascript
myGoogleMap.polyline.add(
    new Array(
        new Array(35.658582050535614, 139.74543124437332),
        new Array(35.668582050535614, 139.73543124437332)
    )
);
```

ポリゴンを追加する
引数：座標配列の配列
```javascript
myGoogleMap.polygon.add(
    new Array(
        new Array(35.658582050535614, 139.74543124437332),
        new Array(35.648582050535614, 139.74543124437332),
        new Array(35.648582050535614, 139.73543124437332),
        new Array(35.658582050535614, 139.73543124437332)
    )
);
```

レクタングル（矩形）を追加する
引数：南西の座標, 北東の座標
```javasript
myGoogleMap.rectangle.add(
    new Array(35.708582050535614, 139.80543124437332),
    new Array(35.758582050535614, 139.84543124437332)
);
```

サークル（円）を追加する
引数：円の中心座標, 半径（単位：m）
```javascript
myGoogleMap.circle.add(35.658582050535614, 139.74543124437332, 5000);
```

#### 座標系について
基本は世界測地系（WGS84）を使ってください
日本測地系を使用する場合はmetricオプションにtrueを設定してください
```javascript
myGooleMap.myOptions.metric = true;
```

### myPolygon
図形を描画して距離や面積を計測するクラス
引数：GoogleMapのmapオブジェクト
```javascript
myPolygon.make(myGoogleMap.map);
```

### myStreetView
ストリートビューを表示するクラス
引数：ストリートビューを表示するHTMLタグID, 緯度, 経度
```javascript
myStreetView.make('streetview', 35.658582050535614, 139.74543124437332);
```
