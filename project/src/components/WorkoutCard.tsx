import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import type { Workout } from '../types';

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center mb-4">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-sm text-gray-500">{new Date(workout.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {workout.type}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {workout.duration} minutes • {workout.intensity} intensity
          </span>
        </div>

        <div className="space-y-2">
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="text-sm">
              {exercise.name} - {exercise.sets}x{exercise.reps}
              {exercise.weight && ` @ ${exercise.weight}kg`}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <button className="flex items-center text-gray-500 hover:text-blue-600">
          <Heart className="w-5 h-5" />
          <span className="ml-2">{workout.likes}</span>
        </button>
        <button className="flex items-center text-gray-500 hover:text-blue-600">
          <MessageCircle className="w-5 h-5" />
          <span className="ml-2">{workout.comments.length}</span>
        </button>
        <button className="flex items-center text-gray-500 hover:text-blue-600">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}