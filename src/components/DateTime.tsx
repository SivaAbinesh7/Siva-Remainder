
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DateTime: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-md animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-2xl md:text-3xl font-bold text-pink-600">
            <Clock className="mr-2 h-6 w-6" />
            <span>{format(currentDate, 'hh:mm:ss a')}</span>
          </div>
          <div className="flex items-center text-lg md:text-xl text-pink-500">
            <Calendar className="mr-2 h-5 w-5" />
            <span>{format(currentDate, 'EEEE, MMMM do, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTime;
