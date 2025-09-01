import React, { useState, useEffect } from 'react';
import { BookOpenIcon, CommandLineIcon, ServerIcon, CogIcon, RocketLaunchIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const MkDocsTemplate = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState(0);

  const navItems = [
    { id: 'getting-started', label: 'Getting Started', icon: RocketLaunchIcon },
    { id: 'installation', label: 'Installation', icon: CommandLineIcon },
    { id: 'creating-project', label: 'Creating a Project', icon: BookOpenIcon },
    { id: 'dev-server', label: 'Development Server', icon: ServerIcon },
    { id: 'configuration', label: 'Configuration', icon: CogIcon },
  ];

  const searchableContent = [
    { id: 'getting-started', title: 'Getting Started', description: 'Introduction to MkDocs documentation' },
    { id: 'installation', title: 'Installation', description: 'Install MkDocs with pip install mkdocs' },
    { id: 'creating-project', title: 'Creating a new project', description: 'Create and set up a new MkDocs project' },
    { id: 'creating-project', title: 'Initial MkDocs layout', description: 'Understanding the project structure and files' },
    { id: 'dev-server', title: 'Development Server', description: 'Run mkdocs serve to preview documentation' },
    { id: 'configuration', title: 'Configuration', description: 'Configure your MkDocs site settings' },
    { id: 'configuration', title: 'Adding pages', description: 'Add new pages and navigation to your docs' },
    { id: 'configuration', title: 'Theming', description: 'Change themes and customize appearance' },
    { id: 'configuration', title: 'Building the site', description: 'Build static site with mkdocs build' },
    { id: 'deploying', title: 'Deploying', description: 'Deploy your documentation site to hosting' },
  ];

  const tocItems = [
    { id: 'installation', title: 'Installation' },
    { id: 'creating-project', title: 'Creating a project' },
    { id: 'dev-server', title: 'Development Server' },
    { id: 'configuration', title: 'Configuration', subItems: [
      { id: 'configuration', title: 'Adding pages' },
      { id: 'configuration', title: 'Theming' },
      { id: 'configuration', title: 'Building the site' }
    ]},
    { id: 'deploying', title: 'Deploying' },
  ];

  // Search functionality
  const filteredResults = searchableContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (sectionId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    scrollToSection(sectionId);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    
    // Find current section in search results for context-aware highlighting
    const currentSectionIndex = searchableContent.findIndex(item => 
      item.id === activeSection
    );
    
    setSelectedResult(currentSectionIndex >= 0 ? currentSectionIndex : 0);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSelectedResult(0);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openSearch();
      }
      
      // Escape to close search
      if (event.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
      
      // Arrow keys and Enter for search results
      if (isSearchOpen && filteredResults.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedResult(prev => Math.min(prev + 1, filteredResults.length - 1));
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedResult(prev => Math.max(prev - 1, 0));
        } else if (event.key === 'Enter') {
          event.preventDefault();
          handleSearchSelect(filteredResults[selectedResult].id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, filteredResults, selectedResult]);

  // Reset selected result when search query changes
  useEffect(() => {
    setSelectedResult(0);
  }, [searchQuery]);

  // Scroll spy functionality
  useEffect(() => {
    const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
    
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -66%',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">MkDocs</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={openSearch}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                title="Search documentation (⌘K)"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="hidden lg:block w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        activeSection === item.id
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
          <article className="prose prose-gray dark:prose-invert max-w-none">
            
            {/* Getting Started Section */}
            <section id="getting-started" className="mb-16">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">MkDocs</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Project documentation with Markdown.
              </p>
            </section>

            {/* Installation Section */}
            <section id="installation" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Installation</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To install MkDocs, run the following command from the command line:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  pip install mkdocs
                </code>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                For more details, see the <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Installation Guide</a>.
              </p>
            </section>

            {/* Creating Project Section */}
            <section id="creating-project" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Creating a new project</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Getting started is super easy. To create a new project, run the following command from the command line:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  <code>{`mkdocs new my-project
cd my-project`}</code>
                </pre>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Take a moment to review the initial project that has been created for you.
              </p>
              
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">The initial MkDocs layout</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                There's a single configuration file named <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">mkdocs.yml</code>, and a folder named <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">docs</code> that will contain your documentation source files (<code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">docs</code> is the default value for the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">docs_dir</code> configuration setting). Right now the docs folder just contains a single documentation page, named <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">index.md</code>.
              </p>
            </section>

            {/* Development Server Section */}
            <section id="dev-server" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Development Server</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MkDocs comes with a built-in dev-server that lets you preview your documentation as you work on it. Make sure you're in the same directory as the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">mkdocs.yml</code> configuration file, and then start the server by running the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">mkdocs serve</code> command:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  <code>{`$ mkdocs serve
INFO    -  Building documentation...
INFO    -  Cleaning site directory
INFO    -  Documentation built in 0.22 seconds
INFO    -  [15:50:43] Watching paths for changes: 'docs', 'mkdocs.yml'
INFO    -  [15:50:43] Serving on http://127.0.0.1:8000/`}</code>
                </pre>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Open up <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">http://127.0.0.1:8000/</code> in your browser, and you'll see the default home page being displayed.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                The dev-server also supports auto-reloading, and will rebuild your documentation whenever anything in the configuration file, documentation directory, or theme directory changes.
              </p>
            </section>

            {/* Configuration Section */}
            <section id="configuration" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Configuration</h2>
              
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Adding pages</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Now add a second page to your documentation:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  curl 'https://jaspervdj.be/lorem-markdownum/markdown.txt' > docs/about.md
                </code>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                As our documentation site will include some navigation headers, you may want to edit the configuration file and add some information about the order, title, and nesting of each page in the navigation header by adding a <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">nav</code> setting:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  <code>{`site_name: MkLorum
nav:
  - Home: index.md
  - About: about.md`}</code>
                </pre>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Theming</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Now change the configuration file to alter how the documentation is displayed by changing the theme. Edit the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">mkdocs.yml</code> file and add a theme setting:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  <code>{`site_name: MkLorum
nav:
  - Home: index.md
  - About: about.md
theme: readthedocs`}</code>
                </pre>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Building the site</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                That's looking good. You're ready to deploy the first pass of your documentation. First build the documentation:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  mkdocs build
                </code>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This will create a new directory, named <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">site</code>. Take a look inside the directory:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  <code>{`$ ls site
about  fonts  index.html  license  search.html
css    img    js          mkdocs   sitemap.xml`}</code>
                </pre>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> The <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">site_name</code> configuration option is the only required option in your configuration file.
                </p>
              </div>
            </section>

            {/* Deploying Section */}
            <section id="deploying" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Deploying</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The documentation site that you just built only uses static files so you'll be able to host it from pretty much anywhere. Simply upload the contents of the entire site directory to wherever you're hosting your website from and you're done.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                For specific instructions on a number of common hosts, see the <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Deploying your Docs</a> page.
              </p>
            </section>

          </article>
        </main>

        {/* Right Table of Contents (optional) */}
        <aside className="hidden xl:block w-64 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              On this page
            </h3>
            <ul className="space-y-2 text-sm">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left transition-colors ${
                      activeSection === item.id
                        ? 'text-purple-600 dark:text-purple-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                  >
                    {item.title}
                  </button>
                  {item.subItems && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.subItems.map((subItem, index) => (
                        <li key={`${subItem.id}-${index}`}>
                          <button
                            onClick={() => scrollToSection(subItem.id)}
                            className={`block w-full text-left transition-colors ${
                              activeSection === subItem.id
                                ? 'text-purple-600 dark:text-purple-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                            }`}
                          >
                            {subItem.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={closeSearch}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-900/10 dark:ring-gray-100/10">
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none text-sm"
                autoFocus
              />
              <button
                onClick={closeSearch}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto py-2">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <button
                    key={`${item.id}-${item.title}-${index}`}
                    onClick={() => handleSearchSelect(item.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      index === selectedResult 
                        ? 'bg-purple-50 dark:bg-purple-900/20' 
                        : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.title}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {item.description}
                    </div>
                  </button>
                ))
              ) : searchQuery ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Type to search documentation...
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <span>Press ↵ to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MkDocsTemplate;