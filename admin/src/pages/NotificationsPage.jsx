import { useState } from 'react';
import { Bell, Send, Image, Users, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { adminApi } from '../lib/api';

export default function NotificationsPage() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    image: '',
    targetType: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await adminApi.sendNotification(formData);
      setSuccess(true);
      setFormData({ title: '', body: '', image: '', targetType: 'all' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const targetOptions = [
    { value: 'all', label: 'All Users', icon: Users, description: 'Send to everyone' },
    { value: 'location', label: 'By Location', icon: MapPin, description: 'Filter by state/city' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Push Notifications</h1>
        <p className="text-gray-500 mt-1">Send notifications to app users</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 animate-fadeIn">
        {success && (
          <div className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 animate-fadeIn">
            <CheckCircle className="w-5 h-5" />
            Notification sent successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 animate-fadeIn">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Send To</label>
            <div className="grid grid-cols-2 gap-3">
              {targetOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, targetType: option.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.targetType === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <option.icon className={`w-5 h-5 mb-2 ${
                    formData.targetType === option.value ? 'text-orange-500' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-gray-800">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Notification title"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              rows="4"
              placeholder="Notification message..."
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image URL (optional)
              </span>
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Preview */}
          {(formData.title || formData.body) && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2">Preview</p>
              <div className="bg-white rounded-lg p-4 shadow-sm flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{formData.title || 'Title'}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{formData.body || 'Message body...'}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Notification
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
