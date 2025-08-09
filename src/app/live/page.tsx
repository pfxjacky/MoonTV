'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import LivePlayer from '@/components/LivePlayer'; // Import the new player component

// Define the type for a single Live TV channel
interface LiveTvChannel {
  name: string;
  logo: string;
  url: string;
}

const LiveTVPage = () => {
  const [channels, setChannels] = useState<LiveTvChannel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<LiveTvChannel | null>(null);

  useEffect(() => {
    const runtimeConfig = (window as any).RUNTIME_CONFIG || {};
    const liveTvChannels = runtimeConfig.LIVE_TV_CHANNELS || [];
    setChannels(liveTvChannels);
    if (liveTvChannels.length > 0) {
      setCurrentChannel(liveTvChannels[0]);
    }
  }, []);

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-80px)]">
        {/* Channel List */}
        <div className="w-full md:w-64 lg:w-72 xl:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700/50 flex-shrink-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">电视直播</h2>
          </div>
          <ul className="overflow-y-auto h-full p-2">
            {channels.map((channel) => (
              <li
                key={channel.name}
                className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors duration-200 ${
                  currentChannel?.url === channel.url
                    ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 font-semibold'
                    : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setCurrentChannel(channel)}
              >
                <img src={channel.logo} alt={channel.name} className="w-10 h-6 object-contain mr-3" />
                <span className="text-sm">{channel.name}</span>
              </li>
            ))}
            {channels.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                没有可用的直播频道。
              </div>
            )}
          </ul>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black h-64 md:h-auto">
          {currentChannel ? (
            <LivePlayer url={currentChannel.url} name={currentChannel.name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
              <p className="text-lg">请从左侧选择一个频道进行播放</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default LiveTVPage;
