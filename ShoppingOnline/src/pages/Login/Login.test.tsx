import { screen, waitFor, fireEvent } from '@testing-library/react'
import path from 'src/constants/path'
import { logScreen, renderWithRouter } from 'src/utils/testUtils'
import { beforeAll, describe, expect, it } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

describe('Login', () => {
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })
    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
  })
  it('Hiển thị lỗi required khi không nhập gì', async () => {
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(screen.queryByText('Email là bắt buộc')).toBeTruthy()
      expect(screen.queryByText('Password là bắt buộc')).toBeTruthy()
    })
  })
  it('Hiển thị lỗi khi nhập value input sai', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'q@merry.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(screen.queryByText('Email không đúng định dạng')).toBeTruthy()
      expect(screen.queryByText('Độ dài từ 6 - 160 ký tự')).toBeTruthy()
    })
  })

  it('Không nên hiển thị lỗi khi nhập lại value đúng', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'q@merry.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123456'
      }
    })
    // Những trường hợp chứng minh rằng tìm không ra text hay là element
    // Thì nên dùng query hơn là find hay get
    await waitFor(() => {
      expect(screen.queryByText('Email không đúng định dạng')).toBeFalsy()
      expect(screen.queryByText('Độ dài từ 6 - 160 ký tự')).toBeFalsy()
    })
    fireEvent.submit(submitButton)
    // await logScreen()
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang chủ | Shopee Clone')
    })
    // console.log(await screen.findByText('Email không đúng định dạng'))
  })
})
