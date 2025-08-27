import { useState, useEffect } from "react"
import { Search, Star, ExternalLink, Github, Loader2 } from "lucide-react"
import AxiosService from "./utils/AxiosService";
import ApiRoutes from "./utils/ApiRoutes"

function App() {
  const [keyword, setKeyword] = useState("")
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return
    
    setLoading(true)
    setError("")
    setSearchPerformed(true)
    
    try {
      let res = await AxiosService.get(`${ApiRoutes.SEARCH.path}?keyword=${keyword}`)
      setRepos(res.data.repos)
    } 
    catch (err) {
      setError("Failed to fetch repositories. Please try again.")
      setRepos([])
    } 
    finally {
      setLoading(false)
    }
  }

  const getrepos = async() => {
    try {
      setLoading(true)
      let res = await AxiosService.get(`${ApiRoutes.ALLREPOS.path}`)
      let result = res.data.repos
      if(res.status === 200){
        setRepos(res.data.repos)
        setLoading(false)
      }
    } catch (error) {
      setError("Failed to load repositories");
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-100 text-yellow-800',
      TypeScript: 'bg-blue-100 text-blue-800',
      Python: 'bg-green-100 text-green-800',
      Java: 'bg-orange-100 text-orange-800',
      Markdown: 'bg-gray-100 text-gray-800'
    };
    return colors[language] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    getrepos()
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Github className="w-8 h-8 text-gray-700" />
              <h1 className="text-3xl font-bold text-gray-900">
                GitHub Repository Search
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Discover and explore amazing repositories from the GitHub community
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="Search repositories by keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !keyword.trim()}
              className="absolute inset-y-0 right-0 px-6 bg-blue-600 text-white rounded-r-2xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div>
          {!searchPerformed && repos.length > 0 && (
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Repositories
              </h2>
              <p className="text-gray-600">Here are some repositories from our database of your last search</p>
            </div>
          )}

          {searchPerformed && !loading && repos.length > 0 && (
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Search Results for "{keyword}"
              </h2>
              <p className="text-gray-600">Found {repos.length} repositories</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Searching repositories...</p>
              </div>
            </div>
          ) : repos.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group-hover:text-blue-600"
                      >
                        <span className="truncate">{repo.name}</span>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {repo.description || "No description available"}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium">{repo.stars?.toLocaleString() || 0}</span>
                        </div>
                        
                        {repo.language && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(repo.language)}`}>
                            {repo.language}
                          </span>
                        )}
                      </div>
                      
                      {repo.updated_at && (
                        <span className="text-xs text-gray-500">
                          Updated {formatDate(repo.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      View on GitHub →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : searchPerformed && !loading ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Github className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No repositories found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or explore different keywords
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;