
import React from 'react';

export const TerminalSkeleton = () => (
    <div className="h-full w-full bg-black p-4 space-y-4 animate-pulse">
        <div className="h-4 w-1/3 bg-gray-800 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-800 rounded"></div>
        <div className="h-4 w-1/4 bg-gray-800 rounded"></div>
        <div className="mt-8 space-y-2">
             <div className="h-4 w-full bg-gray-900 rounded"></div>
             <div className="h-4 w-full bg-gray-900 rounded"></div>
             <div className="h-4 w-2/3 bg-gray-900 rounded"></div>
        </div>
    </div>
);

export const AppSkeleton = () => (
    <div className="h-full w-full bg-white/5 p-4 animate-pulse flex flex-col gap-4">
        <div className="h-10 w-full bg-white/10 rounded-lg"></div>
        <div className="flex gap-4 h-full">
            <div className="w-1/4 h-full bg-white/5 rounded-lg"></div>
            <div className="flex-1 h-full bg-white/5 rounded-lg"></div>
        </div>
    </div>
);
