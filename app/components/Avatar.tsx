const Avatar = ({ user }: any) => {
  const { avatar, first_name, last_name, email } = user || {}

  const initials = `${first_name.charAt(0)}${last_name.charAt(0)}`
  const emailInitials = `${email.charAt(0)}`
  const avatarUrl =
    avatar?.url || `https://ui-avatars.com/api/?name=${initials || emailInitials}&size=96`
  return (
    <div className="flex items-center justify-center">
      <img src={avatarUrl} className="rounded-full w-10 h-10" alt="Avatar" />
    </div>
  )
}

export default Avatar
