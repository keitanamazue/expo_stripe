# React Native Admob & RevenueCat Samples

このリポジトリはReact Nativeで作成したAdmobとRevenueCatのサンプルアプリケーションです。
以下のZenn Bookと合わせて参照いただけるように作成しました。

[
React Nativeで作ったスマホアプリにAdmob（広告）とRevenue Cat（課金）を使ってマネタイズする](https://zenn.dev/hal1986/books/react-native-monetize)

当リポジトリだけでも参考になると思いますが、こちらの本も参考にしていただけるとよりわかりやすいと思います。
（有料で恐縮ですが・・・）

#　起動方法 
以下の手順で概ね起動すると思います。
React Nativeのプロジェクト（Expo Bare Workflow）ですので、通常のReact Nativeプロジェクト同様に起動してください。

```sh
git clone https://github.com/hareruya-maro/monetize.git
cd monetize
yarn install
yarn run start
# 以下いずれか
yarn run ios
yarn run android
```