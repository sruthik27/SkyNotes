import { Trash2 } from 'lucide-react';

export const TrashBin = ({ isNoteHovering }) => (
    <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 p-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
            isNoteHovering ? 'scale-125 bg-red-50' : ''
        }`}
        style={{
            zIndex: 2000,
        }}
    >
        <Trash2
            className={`w-8 h-8 transition-colors duration-300 ${
                isNoteHovering ? 'text-red-500' : 'text-gray-400'
            }`}
        />
    </div>
);