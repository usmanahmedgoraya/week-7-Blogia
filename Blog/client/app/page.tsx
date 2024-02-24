'use client'
import Blogs from "@/components/Blog/Blogs";

export default function Home() {
  // const router = useRouter()
  // useEffect(() => {
  //   const isAuthExist: any = localStorage.getItem('Auth')
  //   const Auth: any = JSON.parse(isAuthExist)

  //   if (!isAuthExist) {
  //     router.push('/auth/login')
  //   }

  // }, [])

  return (
    <div className="flex justify-center">
      <Blogs />
    </div>
  );
}
