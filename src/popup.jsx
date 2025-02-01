import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/ui/button';
import { BookmarkPlus, Link as LinkIcon, Trash2 } from 'lucide-react';
import './index.css';

const PASTEL_COLORS = [
    '#FFB3BA', // pastel pink
    '#BAFFC9', // pastel green
    '#BAE1FF', // pastel blue
    '#FFFFBA', // pastel yellow
    '#FFE4BA', // pastel orange
    '#E8BAFF', // pastel purple
];

const Popup = () => {
    const [currentUrl, setCurrentUrl] = useState('');
    const [currentTitle, setCurrentTitle] = useState('');
    const [pageNotes, setPageNotes] = useState([]);
    const [newNoteText, setNewNoteText] = useState('');
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // Use the Chrome extension API to get the active tab's URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                // Crucial: Use tabs[0].url instead of relying on internal extension context
                setCurrentUrl(tabs[0].url);
                setCurrentTitle(tabs[0].title || '');
            }
        });

        // Get notes from local storage
        chrome.storage.local.get(['floatingNotes'], (result) => {
            const storedNotes = result.floatingNotes || [];
            setNotes(storedNotes);
            setPageNotes(storedNotes.filter(note => note.url === currentUrl));
        });
    }, [currentUrl]);

    const handleAddNote = () => {
        if (!newNoteText.trim()) return;

        const note = {
            id: Date.now().toString(),
            text: newNoteText,
            url: currentUrl,
            color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
            timestamp: Date.now()
        };

        const updatedNotes = [...notes, note];
        chrome.storage.local.set({ floatingNotes: updatedNotes }, () => {
            setNotes(updatedNotes);
            setNewNoteText('');
            setPageNotes(updatedNotes.filter(note => note.url === currentUrl));
        });
    };

    const handleQuickAdd = () => {
        const note = {
            id: Date.now().toString(),
            text: currentTitle,
            url: currentUrl,
            color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
            timestamp: Date.now()
        };

        const updatedNotes = [...notes, note];
        chrome.storage.local.set({ floatingNotes: updatedNotes }, () => {
            setNotes(updatedNotes);
            window.close(); // Close popup after adding
        });
    };

    const handleDeleteNote = (noteId) => {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        chrome.storage.local.set({ floatingNotes: updatedNotes }, () => {
            setNotes(updatedNotes);
            setPageNotes(updatedNotes.filter(note => note.url === currentUrl));
        });
    };

    return (
        <div className="w-96 p-4 bg-gradient-to-br from-pink-50 to-purple-50">
            {pageNotes.length === 0 && (
                <Button
                    onClick={handleQuickAdd}
                    className="w-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    Quick Note this Page
                </Button>
            )}

            <div className="mb-4">
                <div className="text-sm font-semibold text-purple-700 mb-2">
                    Notes for this Page
                </div>
                {pageNotes.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center">
                        No notes for this page yet
                    </div>
                ) : (
                    <div className="space-y-2">
                        {pageNotes.map(note => (
                            <div
                                key={note.id}
                                className="bg-white p-2 rounded-lg shadow-sm flex items-center group"
                            >
                                <div
                                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                    style={{ backgroundColor: note.color }}
                                />
                                <span className="flex-grow text-sm">{note.text}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="opacity-0 group-hover:opacity-100 hover:bg-red-50 -mr-1"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-purple-700">
                        {pageNotes.length === 0 ? "Add Custom Note" : "Add another note"}
                    </span>
                </div>
                <div className="flex gap-2">
                    <input
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
                        placeholder="Write a note for this page"
                        className="flex-grow p-2 border rounded-lg bg-purple-50"
                    />
                    <Button
                        onClick={handleAddNote}
                        disabled={!newNoteText.trim()}
                        className="bg-purple-500 text-white"
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
};

createRoot(document.getElementById('popup-root')).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);