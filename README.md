# ポートフォリオジェネレーター (Portfolio Generator)

このプロジェクトは、ユーザーが入力した情報に基づいてポートフォリオサイトを自動生成するNext.jsアプリケーションです。

## ✨ 主な機能

-   **プロフィール入力:** 氏名、経歴、スキル、自己PRなどを簡単に入力できます。
-   **テンプレート選択:** 複数のデザインテンプレートから好みのものを選べます。
-   **リアルタイムプレビュー:** 入力内容がリアルタイムでプレビューに反映されます。
-   **AIによるサポート:** Google Gemini APIを利用した文章校正機能や、自己PRに基づいた想定問答を生成する機能があります。
-   **ZIPダウンロード:** 生成されたポートフォリオサイトをHTML/CSS/JSファイルとして一括でダウンロードできます。
-   **認証機能:** GitHub/Googleアカウントでのログインに対応しており、入力内容を保存できます。

## 🛠️ 使用技術

-   **フレームワーク:** [Next.js](https://nextjs.org/)
-   **言語:** [TypeScript](https://www.typescriptlang.org/)
-   **認証:** [NextAuth.js](https://next-auth.js.org/)
-   **データベース:** [Vercel KV](https://vercel.com/storage/kv)
-   **AI:** [Google Gemini API](https://ai.google.dev/)
-   **UI/スタイル:** [React](https://react.dev/), [Bootstrap](https://getbootstrap.com/)

---

## 🚀 環境構築ガイド

このプロジェクトをローカル環境でセットアップする手順です。

### 1. 前提条件

-   [Node.js](https://nodejs.org/ja) (v18.17.0 以上を推奨)
-   [npm](https://www.npmjs.com/) (Node.jsに同梱)

### 2. プロジェクトのクローン

まず、このリポジトリをクローンします。

```bash
git clone https://github.com/あなたのユーザー名/このリポジトリ名.git
cd このリポジトリ名
```

### 3. 依存関係のインストール

次に、プロジェクトに必要なパッケージをインストールします。

```bash
npm install
```

### 4. 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` という名前のファイルを作成してください。このファイルに、アプリケーションが動作するために必要なAPIキーなどの情報を記述します。

以下の内容を `.env.local` にコピーして、それぞれの値を設定してください。

```env
# NextAuth.js
# ターミナルで `openssl rand -base64 32` を実行して生成した値を設定
NEXT_AUTH_SECRET=

# GitHub OAuth App
# https://github.com/settings/developers から取得
GITHUB_ID=
GITHUB_SECRET=

# Google Cloud Console
# https://console.cloud.google.com/apis/credentials から取得
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Google Gemini API
# https://aistudio.google.com/app/apikey から取得
GEMINI_API_KEY=

# Vercel KV
# Vercelのプロジェクトから取得
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

**各変数の取得先:**
-   `NEXT_AUTH_SECRET`: ターミナルで `openssl rand -base64 32` コマンドを実行して生成できます。
-   `GITHUB_*`: [GitHubのDeveloper settings](https://github.com/settings/developers) でOAuth Appを作成して取得します。
-   `GOOGLE_*`: [Google Cloud Console](https://console.cloud.google.com/apis/credentials) でOAuth 2.0 クライアントIDを作成して取得します。
-   `GEMINI_API_KEY`: [Google AI Studio](https://aistudio.google.com/app/apikey) でAPIキーを取得します。
-   `KV_*`: [Vercel](https://vercel.com/) でプロジェクトを作成し、KVストアを接続して取得します。

### 5. 開発サーバーの起動

すべての設定が完了したら、開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

## 📜 利用可能なスクリプト

-   `npm run dev`: 開発モードでアプリケーションを起動します。
-   `npm run build`: プロダクション用にアプリケーションをビルドします。
-   `npm run start`: ビルドされたプロダクションサーバーを起動します。
-   `npm run lint`: ESLintを実行してコードの静的解析を行います。
