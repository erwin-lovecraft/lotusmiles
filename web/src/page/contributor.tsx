import avatarLoc from '@/assets/loc-dev.webp';
import avatarSan from '@/assets/san-dev.webp';
import avatarLy from '@/assets/ly-po.webp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from '@/lib/hooks';

export default function Contributor() {
  const { contributor } = useTranslations();

  const contributors = [
    {
      name: "Loc Dang",
      role: "Backend Developer (Doing Frontend)",
      image: avatarLoc,
      joke: "Why do backend developers hate CSS? Because they can't center a div even with 50 different approaches! 😅",
      skills: ["Go", "Gin", "GORM", "React", "TypeScript"],
      github: "locdang",
      funFact: "Currently learning that 'just make it look good' is not a valid CSS instruction"
    },
    {
      name: "San Tran",
      role: "Frontend Developer (Doing Backend)",
      image: avatarSan,
      joke: "Why did the frontend developer become a backend developer? Because they got tired of arguing with designers about pixel-perfect alignment! 🎨",
      skills: ["React", "TypeScript", "Go", "Gin", "GORM"],
      github: "santran",
      funFact: "Discovering that backend errors are much scarier than console.log()"
    },
    {
      name: "Ly Tran",
      role: "Product Owner & QC Engineer",
      image: avatarLy,
      joke: "Why do Product Owners make great testers? Because they're experts at finding problems that don't exist! 🔍",
      skills: ["Scrum", "JIRA", "Testing", "Bug Reports", "User Stories"],
      github: "lytran",
      funFact: "Living the dream: writing user stories and then breaking them herself"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {contributor.title} 🚀
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {contributor.subtitle}
          </p>
        </div>

        {/* Contributors Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {contributors.map((person, idx) => (
            <Card key={idx} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 ring-4 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300">
                    <AvatarImage src={person.image} alt={person.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {person.name}
                </CardTitle>
                <Badge variant="secondary" className="text-sm px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {person.role}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Joke Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700 italic">"{person.joke}"</p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">🛠️</span>
                    Skills (Current + Learning)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {person.skills.map((skill, skillIdx) => (
                      <Badge key={skillIdx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Fun Fact */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <span className="mr-2">💡</span>
                    Fun Fact
                  </h4>
                  <p className="text-sm text-gray-600">{person.funFact}</p>
                </div>

                {/* GitHub Link */}
                <div className="text-center">
                  <a
                    href={`https://github.com/${person.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    <span className="mr-2">🐙</span>
                    GitHub Profile
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <Separator className="mb-8" />
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-100 to-blue-100">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">🚀 Ready to Join Our Team?</h3>
              <p className="text-gray-700 mb-4">
                We're always looking for talented developers who can debug their way out of a paper bag!
                Bonus points if you can handle multiple roles at once! 🎪
              </p>
              <p className="text-sm text-gray-600 italic">
                "The best code is no code at all" - Some wise developer, probably
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hidden Easter Egg - The original iframe */}
        <iframe
          width="0"
          height="0"
          src="https://www.youtube.com/embed/t50yYX2dLEY?autoplay=1&loop=1&playlist=t50yYX2dLEY&mute=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="hidden"
        ></iframe>
      </div>
    </div>
  );
}
