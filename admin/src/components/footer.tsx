export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              © 2024 Apollo Airlines. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Admin Portal</span>
            <span>•</span>
            <span>Support: admin@lotusmile.com</span>
          </div>
        </div>

        {/* AI Powered Footer Section */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <span>🤖</span>
            <span className="font-medium">Powered by Generative AI Free Tier</span>
            <span>⚡</span>
            <span>•</span>
            <span>Made with ☕ and 🍕</span>
            <span>•</span>
            <span>Debugged with 🐛 and 💻</span>
            <span>•</span>
            <span>Deployed with 🚀 and 🙏</span>
            <span>•</span>
            <span>Bug-free* (*terms and conditions apply) 😅</span>
          </div>
          <div className="mt-2 text-center text-xs text-gray-300">
            <span>💡 Pro tip: If you see this footer, the AI didn't crash! 🎉</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
