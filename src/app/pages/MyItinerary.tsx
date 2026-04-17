import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Calendar, Plus, Trash2, MapPin, Clock, DollarSign, Download, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ItineraryItem {
  id: string;
  day: number;
  title: string;
  location: string;
  time: string;
  cost: string;
  notes: string;
}

export function MyItinerary() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ItineraryItem[]>([
    {
      id: '1',
      day: 1,
      title: 'Arrival in Kigali',
      location: 'Kigali International Airport',
      time: '14:00',
      cost: '$0',
      notes: 'Hotel transfer included'
    },
    {
      id: '2',
      day: 1,
      title: 'Kigali Genocide Memorial',
      location: 'Kigali',
      time: '16:00',
      cost: 'Free',
      notes: 'Respectful attire required'
    },
    {
      id: '3',
      day: 2,
      title: 'Gorilla Trekking',
      location: 'Volcanoes National Park',
      time: '07:00',
      cost: '$1,500',
      notes: 'Bring hiking boots and rain jacket'
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    day: 1,
    title: '',
    location: '',
    time: '',
    cost: '',
    notes: ''
  });

  // Simulate loading state for "Advanced" feel
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const addItem = () => {
    if (newItem.title && newItem.location) {
      const item: ItineraryItem = {
        id: Date.now().toString(),
        ...newItem
      };
      setItems([...items, item]);
      setNewItem({ day: 1, title: '', location: '', time: '', cost: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  const totalCost = items.reduce((sum, item) => {
    const cost = item.cost.replace(/[^0-9]/g, '');
    return sum + (cost ? parseInt(cost) : 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="text-primary font-bold tracking-widest uppercase text-sm"
          >
            Retrieving Your Journey...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Your Adventure</h1>
                <p className="text-slate-500 font-medium">Curated itinerary for the Land of a Thousand Hills</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary flex items-center justify-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>Add Experience</span>
            </button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: 'Total Days', value: Object.keys(groupedItems).length, icon: Calendar, color: 'text-primary' },
            { label: 'Total Activities', value: items.length, icon: MapPin, color: 'text-primary' },
            { label: 'Estimated Budget', value: `$${totalCost.toLocaleString()}`, icon: DollarSign, color: 'text-primary' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 border-border shadow-sm flex items-center gap-4 transition-all hover:border-primary/30">
              <div className={`p-3 rounded-xl bg-primary/10 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Add Form with Animation */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-2xl p-8 border-2 border-primary/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-primary" />
                  Add New Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label>Itinerary Day</label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.day}
                      onChange={(e) => setNewItem({ ...newItem, day: parseInt(e.target.value) })}
                      className="w-full focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Preferred Time</label>
                    <input
                      type="time"
                      value={newItem.time}
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                      className="w-full focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Experience Title *</label>
                    <input
                      type="text"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      placeholder="e.g., Akagera Safari"
                      className="w-full focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Location *</label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      placeholder="e.g., Eastern Province"
                      className="w-full focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Approx. Cost</label>
                    <input
                      type="text"
                      value={newItem.cost}
                      onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                      placeholder="e.g., $150"
                      className="w-full focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Notes</label>
                    <input
                      type="text"
                      value={newItem.notes}
                      onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                      placeholder="Things to remember"
                      className="w-full focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={addItem} className="btn-primary">Confirm Activity</button>
                  <button onClick={() => setShowAddForm(false)} className="px-6 py-2.5 rounded-lg font-medium text-slate-500 hover:bg-slate-100 transition-colors">Discard</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Itinerary Timeline */}
        <div className="space-y-12">
          {Object.keys(groupedItems).sort((a, b) => parseInt(a) - parseInt(b)).map((day, dayIdx) => (
            <motion.div 
              key={day}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: dayIdx * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl z-10">
                  <span className="text-xl font-black">0{day}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Day {day} Schedule</h2>
              </div>

              <div className="grid gap-6 pl-20 relative before:absolute before:left-[27px] before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-100 before:z-0">
                <AnimatePresence mode="popLayout">
                  {groupedItems[parseInt(day)].map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="card-lift glass rounded-2xl p-6 border-border shadow-sm group overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            {item.time && (
                              <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                <Clock className="w-3 h-3" />
                                {item.time}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </span>
                            {item.cost && (
                              <span className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                                <DollarSign className="w-3 h-3" />
                                {item.cost}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                          {item.notes && (
                            <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                              <Sparkles className="w-4 h-4 text-primary shrink-0" />
                              <p className="text-sm text-slate-600 font-medium italic leading-relaxed">{item.notes}</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-3 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass rounded-3xl border-dashed border-2 border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Blank Canvas</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Your Rwanda journey is waiting to be written. Add your first experience.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Start Building
            </button>
          </motion.div>
        )}

        {/* Action Footer */}
        {items.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 flex justify-center"
          >
            <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter hover:bg-slate-800 transition-all hover:shadow-2xl active:scale-95 group">
              <Download className="w-6 h-6 group-hover:animate-bounce" />
              <span>Download PDF Guide</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}