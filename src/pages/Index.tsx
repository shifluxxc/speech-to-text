
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Mic, FileAudio, History, User } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 md:px-8 mx-auto max-w-6xl text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Convert <span className="text-purple-600">Speech to Text</span> Effortlessly
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Transform your audio recordings and voice into accurate text transcriptions with our powerful speech-to-text technology.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 md:px-8 mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <Mic className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Record Audio</h3>
            <p className="text-gray-600">
              Record audio directly from your device's microphone with a single tap.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <FileAudio className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Upload Files</h3>
            <p className="text-gray-600">
              Upload your existing audio files in MP3, WAV, or WebM format.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <History className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Save History</h3>
            <p className="text-gray-600">
              Access, copy and review all your past transcriptions securely.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 md:px-8 mx-auto max-w-6xl bg-purple-600 rounded-lg text-center text-white my-16">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Convert Your Speech to Text?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create an account now to start transcribing your audio with precision and ease.
        </p>
        <div className="flex justify-center">
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Create Free Account
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
