import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { EmptyState } from './EmptyState.jsx';
import '../styles/animations.css';
import { FloatingHeart } from './FloatingHeart.jsx';
import { TrashBin } from './TrashBin.jsx';
import { Note } from './Note.jsx';
import {NoteInput} from "../NoteInput.jsx";

const PASTEL_COLORS = [
    '#FFB3BA', // pastel pink
    '#BAFFC9', // pastel green
    '#BAE1FF', // pastel blue
    '#FFFFBA', // pastel yellow
    '#FFE4BA', // pastel orange
    '#E8BAFF', // pastel purple
];

const FloatingNotes = () => {
    const [notes, setNotes] = useState([]);
    const [positions, setPositions] = useState({});
    const [velocities, setVelocities] = useState({});
    const [isDragging, setIsDragging] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [showAlert, setShowAlert] = useState(false);
    const [lastPositions, setLastPositions] = useState({});
    const [sparkles, setSparkles] = useState([]);
    const [showColorPalette, setShowColorPalette] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (chrome?.storage?.local) {
            chrome.storage.local.get(['floatingNotes'], (result) => {
                if (result.floatingNotes) {
                    setNotes(result.floatingNotes);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (chrome?.storage?.local) {
            chrome.storage.local.set({ floatingNotes: notes });
        }
    }, [notes]);

    useEffect(() => {
        const newPositions = { ...positions };
        const newVelocities = { ...velocities };

        notes.forEach((note) => {
            if (!positions[note.id]) {
                newPositions[note.id] = {
                    x: Math.random() * (window.innerWidth - 300),
                    y: Math.random() * (window.innerHeight - 300)
                };
                newVelocities[note.id] = {
                    x: (Math.random() - 0.5) * 1.5,
                    y: (Math.random() - 0.5) * 1.5
                };
            }
        });

        setPositions(newPositions);
        setVelocities(newVelocities);
        setLastPositions(newPositions);
    }, [notes]);

    const createSparkle = (x, y) => {
        const sparkle = {
            id: Math.random(),
            x,
            y,
            size: Math.random() * 4 + 2,
            lifetime: 0
        };
        setSparkles(prev => [...prev, sparkle]);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSparkles(prev => prev.filter(sparkle => {
                sparkle.lifetime += 1;
                return sparkle.lifetime < 30;
            }));
        }, 50);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const addImpulse = () => {
            setVelocities(prev => {
                const next = { ...prev };
                Object.keys(next).forEach((id) => {
                    if (isDragging === id) return;
                    const angle = Math.random() * Math.PI * 2;
                    const magnitude = 0.3;
                    next[id].x += Math.cos(angle) * magnitude;
                    next[id].y += Math.sin(angle) * magnitude;
                });
                return next;
            });
        };

        const impulseInterval = setInterval(addImpulse, 3000);
        return () => clearInterval(impulseInterval);
    }, [isDragging]);

    useEffect(() => {
        const initializePositions = () => {
            const newPositions = {};
            const newVelocities = {};

            notes.forEach((note) => {
                if (!positions[note.id]) {
                    newPositions[note.id] = {
                        x: Math.random() * (window.innerWidth - 300),
                        y: Math.random() * (window.innerHeight - 300),
                    };
                    newVelocities[note.id] = {
                        x: (Math.random() - 0.5) * 1.5,
                        y: (Math.random() - 0.5) * 1.5,
                    };
                }
            });

            setPositions((prev) => ({ ...prev, ...newPositions }));
            setVelocities((prev) => ({ ...prev, ...newVelocities }));
        };

        initializePositions();
    }, [notes]);

    const inputAreaRef = useRef(null);

    useEffect(() => {
        const animate = () => {
            setPositions((prev) => {
                const next = { ...prev };
                const inputAreaRect = inputAreaRef.current?.getBoundingClientRect();

                Object.keys(next).forEach((id) => {
                    if (isDragging === id) return;

                    next[id].x += velocities[id].x;
                    next[id].y += velocities[id].y;

                    // Ensure notes do not overlap with the input area
                    if (inputAreaRect) {
                        const noteRect = {
                            left: next[id].x,
                            top: next[id].y,
                            right: next[id].x + 300,
                            bottom: next[id].y + 100,
                        };

                        if (
                            noteRect.right > inputAreaRect.left &&
                            noteRect.left < inputAreaRect.right &&
                            noteRect.bottom > inputAreaRect.top &&
                            noteRect.top < inputAreaRect.bottom
                        ) {
                            next[id].y = inputAreaRect.bottom + 10; // Adjust position to be below the input area
                        }
                    }

                    next[id].x = Math.max(0, Math.min(window.innerWidth - 300, next[id].x));
                    next[id].y = Math.max(0, Math.min(window.innerHeight - 300, next[id].y));

                    if (next[id].x <= 0 || next[id].x >= window.innerWidth - 300) {
                        velocities[id].x *= -1;
                    }
                    if (next[id].y <= 0 || next[id].y >= window.innerHeight - 300) {
                        velocities[id].y *= -1;
                    }

                    Object.keys(next).forEach((otherId) => {
                        if (id === otherId) return;

                        const dx = next[id].x - next[otherId].x;
                        const dy = next[id].y - next[otherId].y;
                        const distance = Math.sqrt(dx ** 2 + dy ** 2);

                        const minDistance = 150;
                        if (distance < minDistance) {
                            const angle = Math.atan2(dy, dx);
                            const force = 0.5;

                            velocities[id].x += Math.cos(angle) * force;
                            velocities[id].y += Math.sin(angle) * force;
                            velocities[otherId].x -= Math.cos(angle) * force;
                            velocities[otherId].y -= Math.sin(angle) * force;
                        }
                    });

                    velocities[id].x *= 0.995;
                    velocities[id].y *= 0.995;
                });

                return next;
            });
        };

        const intervalId = setInterval(animate, 16);
        return () => clearInterval(intervalId);
    }, [isDragging, velocities]);

    const [hearts, setHearts] = useState([]);
    const [noteAnimations, setNoteAnimations] = useState({});

    const createHeart = (x, y) => {
        const heart = {
            id: Math.random(),
            x,
            y,
            lifetime: 0,
        };
        setHearts(prev => [...prev, heart]);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setHearts(prev => prev.filter(heart => {
                heart.lifetime += 1;
                return heart.lifetime < 60;
            }));
        }, 50);

        return () => clearInterval(intervalId);
    }, []);

    const groupedNotes = notes.reduce((acc, note) => {
        if (!note.url) {
            // For notes without URLs, use their ID as key to keep them separate
            acc[note.id] = { notes: [note], color: note.color, url: '' };
        } else {
            if (!acc[note.url]) {
                acc[note.url] = {
                    notes: [],
                    color: note.color,
                    url: note.url
                };
            }
            acc[note.url].notes.push(note);
        }
        return acc;
    }, {});

    const handleNoteClick = (noteId) => {
        setNoteAnimations(prev => ({
            ...prev,
            [noteId]: true
        }));
        setTimeout(() => {
            setNoteAnimations(prev => ({
                ...prev,
                [noteId]: false
            }));
        }, 1000);

        const notePosition = positions[noteId];
        if (notePosition) {
            createHeart(notePosition.x + 150, notePosition.y + 50);
        }
    };

    const handleAddNote = (newNote, inputUrl = '') => {
        if (!newNote.trim()) return;

        // Use a more robust URL capture method
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Prioritize input URL, then current tab URL
            const currentUrl = inputUrl || (tabs[0]?.url && !tabs[0]?.url.endsWith('//newtab/') ? tabs[0].url : Date.now().toString()+'ranfpmsuffix');

            const note = {
                id: Date.now().toString(),
                text: newNote,
                url: currentUrl,
                color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)]
            };

            setNotes(prevNotes => [...prevNotes, note]);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        });
    };

    const handleDelete = (id) => {
        setNotes(notes.filter(note => note.id !== id));
        setPositions(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setVelocities(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const handleMouseDown = (e, id) => {
        e.preventDefault();
        setIsDragging(id);
        const rect = e.currentTarget.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setLastPositions(prev => ({
            ...prev,
            [id]: { x: e.clientX, y: e.clientY }
        }));

        setVelocities(prev => ({
            ...prev,
            [id]: { x: 0, y: 0 }
        }));
    };

    const [isOverTrash, setIsOverTrash] = useState(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 300, e.clientY - dragOffset.y));

        // Check if note is over trash bin
        const isNearTrashBin = e.clientY > window.innerHeight - 200;
        setIsOverTrash(isNearTrashBin);

        const dx = e.clientX - (lastPositions[isDragging]?.x || e.clientX);
        const dy = e.clientY - (lastPositions[isDragging]?.y || e.clientY);
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 5) {
            createSparkle(newX + Math.random() * 300, newY + Math.random() * 300);
        }

        setPositions(prev => ({
            ...prev,
            [isDragging]: { x: newX, y: newY }
        }));

        setVelocities(prev => ({
            ...prev,
            [isDragging]: {
                x: dx * 0.1,
                y: dy * 0.1
            }
        }));

        setLastPositions(prev => ({
            ...prev,
            [isDragging]: { x: e.clientX, y: e.clientY }
        }));
    };

    const handleDeleteNoteGroup = (url) => {
        // If url is empty, it means it's a single note without URL
        const updatedNotes = notes.filter(note => {
            if (!url) {
                return note.id !== isDragging;
            }
            return note.url !== url;
        });

        setNotes(updatedNotes);
        if (chrome?.storage?.local) {
            chrome.storage.local.set({ floatingNotes: updatedNotes });
        }
        setIsDragging(null);
        setIsOverTrash(false);
    };

    const handleMouseUp = () => {
        if (isDragging && isOverTrash) {
            // Find the note being dragged
            const draggedNote = notes.find(note => note.id === isDragging);
            if (draggedNote) {
                // Delete the entire group based on URL
                handleDeleteNoteGroup(draggedNote.url);
            }
        } else if (isDragging) {
            const position = positions[isDragging];
            setLastPositions(prev => ({
                ...prev,
                [isDragging]: position
            }));
        }
        setIsDragging(null);
        setIsOverTrash(false);
    };

    const handleColorChange = (noteId, color) => {
        setNotes(notes.map(note =>
            note.id === noteId ? { ...note, color } : note
        ));
        setShowColorPalette(null);

        // Create sparkles effect when changing color
        const notePosition = positions[noteId];
        if (notePosition) {
            for (let i = 0; i < 5; i++) {
                createSparkle(
                    notePosition.x + Math.random() * 300,
                    notePosition.y + Math.random() * 300
                );
            }
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, lastPositions]);

    const handleUrlClick = (url) => {
        try {
            // Validate and normalize URL
            if (!url) return;

            // Ensure protocol is present
            const formattedUrl = url.match(/^https?:\/\//)
                ? url
                : `https://${url}`;

            // Open URL in a new tab
            window.location.href = formattedUrl;
        } catch (error) {
            console.error('Error opening URL:', error);
        }
    };

    const renderColorPalette = (noteId) => {
        return (
            <div
                className="absolute z-50 flex gap-2 p-2 bg-white rounded-lg shadow-lg"
                style={{
                    top: `${(positions[noteId]?.y || 0) - 50}px`,
                    left: `${(positions[noteId]?.x || 0) + 10}px`
                }}
            >
                {PASTEL_COLORS.map((color) => (
                    <div
                        key={color}
                        onClick={() => handleColorChange(noteId, color)}
                        className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition"
                        style={{
                            backgroundColor: color,
                            border: '2px solid rgba(0,0,0,0.1)'
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-8" ref={containerRef}>
            <NoteInput onAddNote={handleAddNote} />

            {showAlert && (
                <Alert className="max-w-md mx-auto mt-4 bg-green-100 border-green-200">
                    <Sparkles className="w-4 h-4" />
                    <AlertTitle>Note Added!</AlertTitle>
                    <AlertDescription>
                        Your new note is floating! Click and Drag to interact✨
                    </AlertDescription>
                </Alert>
            )}

            {notes.length === 0 && <EmptyState />}

            {hearts.map(heart => (
                <FloatingHeart key={heart.id} heart={heart} />
            ))}

            {sparkles.map(sparkle => (
                <div
                    key={sparkle.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: sparkle.x,
                        top: sparkle.y,
                        width: sparkle.size,
                        height: sparkle.size,
                        backgroundColor: 'yellow',
                        borderRadius: '50%',
                        opacity: 1 - sparkle.lifetime / 30,
                        transform: `scale(${1 - sparkle.lifetime / 30})`,
                        boxShadow: '0 0 8px 2px rgba(255, 215, 0, 0.8)'
                    }}
                />
            ))}

            {Object.entries(groupedNotes).map(([key, group]) => (
                <Note
                    key={key}
                    note={group.notes[0]}
                    groupedNotes={group.notes}
                    position={positions[group.notes[0].id]}
                    isDragging={isDragging === group.notes[0].id}
                    isAnimating={noteAnimations[group.notes[0].id]}
                    onMouseDown={(e) => handleMouseDown(e, group.notes[0].id)}
                    onClick={() => handleNoteClick(group.notes[0].id)}
                    onColorClick={() => setShowColorPalette(group.notes[0].id)}
                    onUrlClick={handleUrlClick}
                />
            ))}
            {showColorPalette && renderColorPalette(showColorPalette)}
            <TrashBin isNoteHovering={isOverTrash} />
        </div>
    );
};

export default FloatingNotes;