import notfound from "@/assets/notfound.png"

export default function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
      <div className="flex flex-col justify-center items-center pt-6">
        <img src={notfound} alt="Not Found"/>
      </div>
    </div>
  )
}
