import React, { useState } from 'react';
import { Star, Link as LinkIcon, PenLine } from 'lucide-react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

export const NoteInput = ({ onAddNote, initialUrl = '' }) => {
    const [newNote, setNewNote] = useState('');
    const [url, setUrl] = useState(initialUrl);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(!!initialUrl);
    const [urlError, setUrlError] = useState(false);

    const isValidUrl = (string) => {
        try {
            new URL(string.includes('://') ? string : `http://${string}`);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = () => {
        if (!newNote.trim()) return;
        if (url && !isValidUrl(url)) {
            setUrlError(true);
            return;
        }
        onAddNote(newNote, url);
        setNewNote('');
        setUrl('');
        setShowUrlInput(false);
    };

    return (
        <div className="max-w-md mx-auto mb-8">
            <div
                className={`
                    relative
                    bg-white/90 rounded-3xl p-6
                    shadow-lg hover:shadow-xl
                    transform transition-all duration-500
                    ${isInputFocused ? 'scale-[1.02] shadow-2xl' : ''}
                    border border-purple-200/50
                    before:absolute before:inset-0 before:rounded-3xl
                    before:bg-gradient-to-br before:from-purple-50 before:to-pink-50
                    before:opacity-50 before:-z-10
                `}
            >
                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20" />
                <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20" />

                <div className="relative">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                            <PenLine className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                            Create Note
                        </h2>
                        <div className="ml-auto flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Input area */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <Input
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                placeholder="What's on your mind?"
                                className={`
                                    w-full bg-white/80
                                    border-2 transition-all duration-300
                                    ${isInputFocused ? 'border-purple-400' : 'border-purple-100'}
                                    focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50
                                    rounded-2xl py-3 px-4
                                    placeholder:text-purple-300
                                `}
                            />
                            <div className={`
                                absolute inset-0 -z-10 rounded-2xl
                                bg-gradient-to-r from-purple-500 to-pink-500
                                opacity-0 group-hover:opacity-10 transition-opacity duration-300
                            `} />
                        </div>

                        {/* URL Input */}
                        {showUrlInput && (
                            <div className="relative group">
                                <Input
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                        setUrlError(false);
                                    }}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    placeholder="Enter URL (optional)"
                                    type="url"
                                    className={`
                                        w-full bg-white/80
                                        border-2 transition-all duration-300
                                        ${urlError ? 'border-red-300' : isInputFocused ? 'border-purple-400' : 'border-purple-100'}
                                        focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50
                                        rounded-2xl py-3 px-4
                                        placeholder:text-purple-300
                                    `}
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                                />
                                {urlError && (
                                    <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                                        Please enter a valid URL
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowUrlInput(!showUrlInput)}
                                className={`
                                    group relative px-4 py-2
                                    text-purple-600 hover:text-purple-700
                                    hover:bg-purple-50 active:bg-purple-100
                                    rounded-xl transition-all duration-300
                                    ${showUrlInput ? 'bg-purple-50' : ''}
                                `}
                            >
                                <LinkIcon className="w-4 h-4 mr-2 inline-block group-hover:rotate-45 transition-transform duration-300" />
                                <span className="text-sm">{showUrlInput ? 'Hide URL' : 'Add Link'}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Helper text */}
                    {isInputFocused && (
                        <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
                            <div className="px-3 py-1 text-xs text-purple-500 bg-white rounded-full shadow-sm border border-purple-100">
                                Press Enter to add ✨
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteInput;