import React, { useEffect, useState } from 'react';
import { Palette, ExternalLink, Globe2,} from 'lucide-react';
import { Button } from '../components/ui/button';
import {getFaviconUrl} from "../metadata.js";

export const Note = ({
                         note,
                         groupedNotes = [],
                         position,
                         isDragging,
                         isAnimating,
                         onMouseDown,
                         onClick,
                         onColorClick,
                         onUrlClick
                     }) => {
    const hasMultipleNotes = groupedNotes.length > 1;
    const [faviconError, setFaviconError] = useState(false);
    const [faviconUrl, setFaviconUrl] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isLinkHovered, setIsLinkHovered] = useState(false);

    useEffect(() => {
        if (note.url) {
            const favicon = getFaviconUrl(note.url);
            setFaviconUrl(favicon);
        }
    }, [note.url]);

    const handleFaviconError = () => {
        setFaviconError(true);
    };

    // Extract domain name for display
    const getDomainName = (url) => {
        try {
            // Add protocol if missing
            const fullUrl = url.startsWith('http') ? url : `https://${url}`;
            const domain = new URL(fullUrl).hostname.replace('www.', '');
            return domain.length > 20 ? domain.substring(0, 20) + '...' : domain;
        } catch {
            return '';
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: position?.x || 0,
                top: position?.y || 0,
                transform: `rotate(${Math.sin((position?.x || 0) * 0.01) * 5}deg)`,
                transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: isDragging ? 1000 : isHovered ? 999 : 1,
            }}
            className={`w-80 backdrop-blur-sm bg-opacity-90 ${
                isAnimating ? 'animate-wiggle' : ''
            } group`}
            onMouseDown={onMouseDown}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`
          relative p-6 rounded-xl shadow-lg 
          transition-all duration-300 ease-in-out
          ${isHovered ? 'shadow-xl transform -translate-y-1' : ''}
        `}
                style={{
                    backgroundColor: note.color,
                    backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
                }}
            >
                <div className="flex justify-between items-start mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onColorClick();
                        }}
                        className={`
              rounded-full p-2 transition-all duration-300
              hover:bg-white hover:bg-opacity-25 hover:scale-110
              group-hover:opacity-100 ${isHovered ? '' : 'opacity-60'}
            `}
                    ><Palette className="w-5 h-5 text-purple-700 transition-colors duration-300" />
                    </Button>

                    {note.url && !note.url.endsWith('ranfpmsuffix') && (
                        <div
                            className="relative group/link"
                            onMouseEnter={() => setIsLinkHovered(true)}
                            onMouseLeave={() => setIsLinkHovered(false)}
                        >
                            <div className="flex items-center">
                                <ExternalLink className={`w-4 h-4 text-gray-500 ${isLinkHovered ? 'invisible' : ''}`} />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUrlClick(note.url);
                                }}
                                className={`
                  relative overflow-hidden
                  rounded-full transition-all duration-300 ease-in-out
                  hover:bg-white hover:bg-opacity-25
                  group-hover:opacity-100 ${isHovered ? '' : 'opacity-60'}
                  ${isLinkHovered ? 'pl-2 pr-3 w-auto' : 'w-10'}
                `}
                            >
                                <div className="flex items-center gap-2">
                                    {!faviconError && faviconUrl ? (
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={faviconUrl}
                                                alt=""
                                                className="w-6 h-6 object-contain rounded-sm p-0.5"
                                                onError={handleFaviconError}
                                            />
                                            <div className="absolute inset-0 bg-white/20 rounded-sm animate-pulse" />
                                        </div>
                                    ) : (
                                        <div className="relative flex-shrink-0 w-6 h-6">
                                            <div className="absolute inset-0 bg-purple-500 bg-opacity-10 rounded-full animate-pulse" />
                                            <Globe2 className="w-6 h-6 text-purple-500 p-0.5" />
                                        </div>
                                    )}
                                    <span
                                        className={`
                      transition-all duration-300 ease-in-out
                      text-sm text-gray-800 whitespace-nowrap
                      ${isLinkHovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'}
                    `}
                                    >
                    {getDomainName(note.url)}
                  </span>
                                    <ExternalLink
                                        className={`
                      w-4 h-4 text-gray-800 transition-all duration-300
                      ${isLinkHovered ? 'rotate-45' : 'rotate-0'}
                    `}
                                    />
                                </div>
                            </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rest of the component remains the same */}
                <div className="relative">
                    {hasMultipleNotes ? (
                        <div className="space-y-3">
                            {groupedNotes.map((groupNote, index) => (
                                <div
                                    key={groupNote.id}
                                    className="flex items-start gap-3 group/note"
                                >
                                    <div className="relative flex-shrink-0 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-800/20 shadow-sm group-hover/note:scale-150 transition-transform" />
                                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-gray-800/10 animate-pulse" />
                                    </div>
                                    <p className="font-medium text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                                        {groupNote.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="font-medium text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                            {note.text}
                        </p>
                    )}
                </div>

                {/* Decorative corner fold */}
                <div className="absolute -top-1 -right-1 w-12 h-12 overflow-hidden pointer-events-none">
                    <div
                        className="absolute transform rotate-45 bg-white/20 shadow-sm w-8 h-8 -right-4 -top-4"
                        style={{
                            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Note;