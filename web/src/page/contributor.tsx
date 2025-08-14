import avatarLoc from '@/assets/loc-dev.webp';
import avatarSan from '@/assets/san-dev.webp';
import avatarLy from '@/assets/ly-po.webp';
import avatarMy from '@/assets/my-tester.webp';

export default function Contributor() {
  const contributors = [
    {
      name: "Loc Dang",
      role: "Frontend Developer",
      image: avatarLoc,
    },
    {
      name: "San Tran",
      role: "Backend Designer",
      image: avatarSan,
    },
    {
      name: "Ly Tran",
      role: "Product Owner",
      image: avatarLy,
    },
    {
      name: "My Tran",
      role: "QC",
      image: avatarMy,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contributors</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {contributors.map((person, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <img
              src={person.image}
              alt={person.name}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {person.name}
            </h3>
            <p className="text-sm text-gray-500">{person.role}</p>
          </div>
        ))}
      </div>
      <iframe
        width="0"
        height="0"
        src="https://www.youtube.com/embed/t50yYX2dLEY?autoplay=1&loop=1&playlist=t50yYX2dLEY&mute=1"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
}
