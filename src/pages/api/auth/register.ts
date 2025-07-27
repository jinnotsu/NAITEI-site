// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { kv } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です。' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'パスワードは6文字以上で入力してください。' },
        { status: 400 }
      )
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください。' },
        { status: 400 }
      )
    }

    // 既存ユーザーのチェック
    const existingUser = await kv.get(`user:${email}`)
    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています。' },
        { status: 409 }
      )
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 12)

    // ユーザーの保存
    await kv.set(`user:${email}`, {
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { message: 'ユーザーが正常に作成されました。' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました。' },
      { status: 500 }
    )
  }
}