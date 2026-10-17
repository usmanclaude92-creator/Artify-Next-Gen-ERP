import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../services/administrationStore';
import { EnterpriseTask, TaskStatus, RequestPriority } from '../../types';
import {
  CheckSquare,
  ListTodo,
  Columns3,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Tag,
  ArrowRight,
  TrendingUp,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface TaskActivityViewProps {
  activeTab?: string;
}

export const TaskActivityView: React.FC<TaskActivityViewProps> = ({ activeTab: initialTab }) => {
  const {
    tasks,
    addTask,
    updateTaskStatus,
    updateTaskProgress,
    toggleChecklistItem,
    completeTask
  } = useAdmin();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    if (initialTab && ['kanban', 'list'].includes(initialTab)) {
      setViewMode(initialTab as 'kanban' | 'list');
    }
  }, [initialTab]);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<EnterpriseTask | null>(null);

  // Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDept, setNewTaskDept] = useState('Office Administration');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Eng. Khalid Al-Amri');
  const [newTaskPriority, setNewTaskPriority] = useState<RequestPriority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [checklistItems, setChecklistItems] = useState<string[]>(['Review requirements', 'Execute deliverables']);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    addTask({
      title: newTaskTitle,
      description: newTaskDesc,
      department: newTaskDept,
      assigneeName: newTaskAssignee,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      checklist: checklistItems.filter(Boolean).map((item, idx) => ({
        id: `chk-${Date.now()}-${idx}`,
        item,
        isDone: false
      }))
    });

    setShowCreateModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setChecklistItems(['Review requirements', 'Execute deliverables']);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.taskNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || t.department === departmentFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesDept && matchesPriority;
  });

  const kanbanColumns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'Todo', label: 'To Do', color: 'border-slate-300 dark:border-slate-600' },
    { status: 'In Progress', label: 'In Progress', color: 'border-blue-400' },
    { status: 'In Review', label: 'In Review', color: 'border-amber-400' },
    { status: 'Completed', label: 'Completed', color: 'border-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              03.05
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Task & Activity Management Engine</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Corporate Kanban workflow, interactive checklists, cross-functional SLA execution</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>List Grid ({tasks.length})</span>
              </button>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search task #, title, assignee..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 focus:outline-none hidden md:block"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {tasks.filter(t => t.status === 'Completed').length} / {tasks.length} tasks completed
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="bg-slate-100/70 dark:bg-slate-800/70 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 flex flex-col min-h-[520px]">
                <div className="flex items-center justify-between pb-3 px-1 mb-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{col.label}</h3>
                    <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-indigo-700 dark:text-indigo-300">{task.taskNumber}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          task.priority === 'Urgent' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' :
                          task.priority === 'High' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">{task.title}</h4>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>Progress</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{task.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              task.progressPercent === 100 ? 'bg-emerald-500' : 'bg-slate-900'
                            }`}
                            style={{ width: `${task.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Checklists Summary */}
                      {task.checklist.length > 0 && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          <span>
                            {task.checklist.filter(c => c.isDone).length} of {task.checklist.length} checklist items
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          <User className="w-3 h-3" /> {task.assigneeName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.dueDate}
                        </span>
                      </div>

                      {/* Quick stage advance */}
                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        {col.status !== 'Completed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus: TaskStatus =
                                col.status === 'Todo' ? 'In Progress' :
                                col.status === 'In Progress' ? 'In Review' : 'Completed';
                              updateTaskStatus(task.id, nextStatus);
                            }}
                            className="w-full py-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Move Next</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Grid View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Task No</th>
                  <th className="p-3.5">Task Title</th>
                  <th className="p-3.5">Assignee</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.map(task => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-700 dark:text-indigo-300">{task.taskNumber}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 max-w-sm truncate">{task.title}</td>
                    <td className="p-3.5 font-medium">{task.assigneeName} ({task.department})</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.priority === 'Urgent' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200' :
                        task.priority === 'High' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-slate-900 h-full rounded-full" style={{ width: `${task.progressPercent}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{task.progressPercent}%</span>
                    </td>
                    <td className="p-3.5 font-medium">{task.dueDate}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' :
                        task.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Drawer / Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">{selectedTask.taskNumber}</span>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedTask.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedTask.description || 'Enterprise administrative task description.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Assignee</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTask.assigneeName}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTask.department}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Due Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTask.dueDate}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Priority</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTask.priority}</span>
              </div>
            </div>

            {/* Checklist Items */}
            {selectedTask.checklist.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Checklist Items</h4>
                <div className="space-y-1.5">
                  {selectedTask.checklist.map(chk => (
                    <div
                      key={chk.id}
                      onClick={() => {
                        toggleChecklistItem(selectedTask.id, chk.id);
                        // update local modal view
                        setSelectedTask({
                          ...selectedTask,
                          checklist: selectedTask.checklist.map(c => c.id === chk.id ? { ...c, isDone: !c.isDone } : c)
                        });
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={chk.isDone}
                        readOnly
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                      <span className={`text-xs ${chk.isDone ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                        {chk.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Change Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex gap-1.5 flex-1">
                {(['Todo', 'In Progress', 'Under Review', 'Completed'] as TaskStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      updateTaskStatus(selectedTask.id, st);
                      setSelectedTask({ ...selectedTask, status: st });
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
                      selectedTask.status === st ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Create Enterprise Operational Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Conduct Biannual Office Asset Verification Audit"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Task Scope & Objectives</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  placeholder="Detailed breakdown of activities to execute..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={e => setNewTaskAssignee(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={newTaskDept}
                    onChange={e => setNewTaskDept(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  >
                    <option value="Office Administration">Office Administration</option>
                    <option value="Executive Management">Executive Management</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Procurement & Logistics">Procurement & Logistics</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={e => setNewTaskDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
