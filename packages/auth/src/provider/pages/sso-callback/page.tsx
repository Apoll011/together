import { AuthAndRedirect, Captcha } from '@repo/auth/components/provider/components'

export default function SSOCallBackPage() {
 return (
    <>
      <AuthAndRedirect />

      <Captcha/>
    </>
  )
}