import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Youtube, ExternalLink, Save, X, Video } from 'lucide-react';

// Mock videos data - will be replaced with API
const initialVideos = [
  {
    id: '1',
    title: '🙏 श्रीमद भागवत कथा - वृन्दावन | Day 1',
    youtubeUrl: 'https://www.youtube.com/watch?v=example1',
    description: 'श्रीमद भागवत कथा का प्रथम दिन - वृन्दावन से प्रसारित',
    thumbnail: 'https://img.youtube.com/vi/example1/maxresdefault.jpg',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '🎵 राधे राधे भजन | Divine Bhajan',
    youtubeUrl: 'https://www.youtube.com/watch?v=example2',
    description: 'राधे राधे भजन - दिव्य संगीत',
    thumbnail: 'https://img.youtube.com/vi/example2/maxresdefault.jpg',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
];

export default function VideosPage() {
  const [videos, setVideos] = useState(initialVideos);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnail = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const openModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setTitle(video.title);
      setYoutubeUrl(video.youtubeUrl);
      setDescription(video.description);
      setIsActive(video.isActive);
    } else {
      setEditingVideo(null);
      setTitle('');
      setYoutubeUrl('');
      setDescription('');
      setIsActive(true);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVideo(null);
    setTitle('');
    setYoutubeUrl('');
    setDescription('');
    setIsActive(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !youtubeUrl.trim()) {
      alert('Title and YouTube URL are required');
      return;
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }

    setLoading(true);

    const videoData = {
      id: editingVideo?.id || Date.now().toString(),
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      description: description.trim(),
      thumbnail: getThumbnail(youtubeUrl),
      isActive,
      order: editingVideo?.order || videos.length + 1,
      createdAt: editingVideo?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: Call API to save video
    // await api.saveVideo(videoData);

    if (editingVideo) {
      setVideos(videos.map(v => v.id === editingVideo.id ? videoData : v));
    } else {
      setVideos([...videos, videoData]);
    }

    setLoading(false);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    // TODO: Call API to delete video
    // await api.deleteVideo(id);
    
    setVideos(videos.filter(v => v.id !== id));
  };

  const toggleActive = async (id) => {
    // TODO: Call API to toggle active status
    setVideos(videos.map(v => 
      v.id === id ? { ...v, isActive: !v.isActive } : v
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Video Management</h1>
          <p className="text-gray-500">Manage YouTube videos displayed in the app</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Video
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{videos.length}</p>
              <p className="text-sm text-gray-500">Total Videos</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Youtube className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{videos.filter(v => v.isActive).length}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Youtube className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{videos.filter(v => !v.isActive).length}</p>
              <p className="text-sm text-gray-500">Hidden</p>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div 
            key={video.id}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${!video.isActive ? 'opacity-60' : ''}`}
          >
            <div className="relative aspect-video bg-gray-100">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/640x360?text=Video';
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white text-2xl ml-1">▶</span>
                </div>
              </div>
              {!video.isActive && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800/80 text-white text-xs rounded">
                  Hidden
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                {video.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {video.description || 'No description'}
              </p>
              
              <div className="flex items-center justify-between">
                <a 
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(video.id)}
                    className={`px-2 py-1 text-xs rounded ${video.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {video.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => openModal(video)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No Videos Added</h3>
          <p className="text-gray-400 mb-4">Add YouTube videos to display in the app</p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Add First Video
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingVideo ? 'Edit Video' : 'Add New Video'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL *
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
                {youtubeUrl && extractVideoId(youtubeUrl) && (
                  <div className="mt-2">
                    <img 
                      src={getThumbnail(youtubeUrl)}
                      alt="Preview"
                      className="w-full rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Show in app (Active)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
