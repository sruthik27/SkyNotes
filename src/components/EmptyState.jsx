import { StickyNote } from 'lucide-react';

export const EmptyState = () => (
    <div className="text-center p-8 animate-float">
        <StickyNote className="w-16 h-16 mx-auto mb-4 text-purple-400" />
        <p className="text-lg text-gray-600">No notes yet! Add your first note✨</p>
    </div>
);