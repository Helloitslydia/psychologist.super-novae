import React, { useEffect, useState } from 'react';
import { Link as LinkIcon, ExternalLink, ArrowLeft, MessageCircle, Send, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Content {
  id: string;
  title: string;
  description: string;
  url: string;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
  psychologist: {
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

interface Comment {
  id: string;
  author_name: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function MentalHealthResources() {
  const [contents, setContents] = useState<Content[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [newComments, setNewComments] = useState<{ [key: string]: { author: string; text: string } }>({});
  const [submissionMessage, setSubmissionMessage] = useState<{ contentId: string; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setIsAdmin(profile?.role === 'psychologist');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    const fetchContents = async () => {
      try {
        const { data, error } = await supabase
          .from('psychologist_content')
          .select('*, psychologist:psychologist_id (profiles (first_name, last_name))')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setContents(data || []);
        
        if (data) {
          const { data: commentsData, error: commentsError } = await supabase
            .from('content_comments')
            .select('id, content_id, author_name, comment, status, created_at')
            .in('content_id', data.map(c => c.id))
            .order('created_at', { ascending: true });

          if (commentsError) throw commentsError;

          const groupedComments = commentsData?.reduce((acc, comment) => {
            if (!acc[comment.content_id]) {
              acc[comment.content_id] = [];
            }
            acc[comment.content_id].push(comment);
            return acc;
          }, {} as { [key: string]: Comment[] });

          setComments(groupedComments || {});
        }
      } catch (error) {
        console.error('Error fetching contents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
    checkAdminStatus();
  }, []);

  const handleSubmitComment = async (contentId: string) => {
    const newComment = newComments[contentId];
    if (!newComment?.author?.trim() || !newComment?.text?.trim()) return;

    try {
      const { data, error } = await supabase
        .from('content_comments')
        .insert([{
          content_id: contentId,
          author_name: newComment.author.trim(),
          comment: newComment.text.trim(),
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setComments(prev => ({
        ...prev,
        [contentId]: [...(prev[contentId] || []), data]
      }));

      // Clear input fields
      setNewComments(prev => ({
        ...prev,
        [contentId]: { author: '', text: '' }
      }));
      // Show submission message
      setSubmissionMessage({
        contentId,
        message: 'Votre commentaire a été envoyé et sera visible après modération'
      });

      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmissionMessage(null);
      }, 5000);

    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleModerateComment = async (commentId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('content_comments')
        .update({ status })
        .eq('id', commentId);

      if (error) throw error;

      // Update local state
      setComments(prev => {
        const newComments = { ...prev };
        Object.keys(newComments).forEach(contentId => {
          newComments[contentId] = newComments[contentId].map(comment =>
            comment.id === commentId ? { ...comment, status } : comment
          );
        });
        return newComments;
      });

    } catch (error) {
      console.error('Error moderating comment:', error);
    }
  };

  const getFilteredComments = (contentId: string) => {
    if (!comments[contentId]) return [];
    return comments[contentId].filter(comment => 
      isAdmin ? true : comment.status === 'approved'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement des ressources...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3">
              <a
                href="https://psychologist.super-novae.org/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Retour</span>
              </a>
              <img
                src="//c5ceaa4e16cfaa43c4e175e2d8739333.cdn.bubble.io/f1737549126604x138366551156432480/logo-sn.jpeg"
                alt="Super-Novae Logo"
                className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
              <h1 className="text-2xl font-bold text-gray-900 text-center">Ressources en santé mentale</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {contents.length === 0 ? (
          <div className="text-center text-gray-500">
            Aucune ressource disponible pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <div
                key={content.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
                {content.description && (
                  <p className="text-gray-700 mb-4">{content.description}</p>
                )}
                {content.url && (
                  <div className="space-y-3">
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={content.url}
                          title={content.title}
                          className="w-full h-full"
                          sandbox="allow-same-origin allow-scripts"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3 border-t bg-white">
                        <a
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink size={16} />
                          Ouvrir dans un nouvel onglet
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {content.file_url && (
                  <div className="space-y-3">
                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                      {content.file_type === 'image' ? (
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={content.file_url}
                            alt={content.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="p-4 flex items-center justify-center">
                          <File className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="p-3 border-t bg-white">
                        <a
                          href={content.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink size={16} />
                          {content.file_type === 'image' ? 'Voir l\'image' : 'Voir le PDF'}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Comments section */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <MessageCircle size={20} className="text-gray-500" />
                    Commentaires ({getFilteredComments(content.id).length})
                  </h4>
                  
                  <div className="space-y-4 mb-4">
                    {getFilteredComments(content.id).map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <span className="font-medium">{comment.author_name}</span>
                          <div className="flex items-center gap-2">
                            {isAdmin && comment.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleModerateComment(comment.id, 'approved')}
                                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                                >
                                  Approuver
                                </button>
                                <button
                                  onClick={() => handleModerateComment(comment.id, 'rejected')}
                                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                  Rejeter
                                </button>
                              </div>
                            )}
                            {isAdmin && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                comment.status === 'approved' ? 'bg-green-100 text-green-700' :
                                comment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {comment.status === 'approved' ? 'Approuvé' :
                                 comment.status === 'rejected' ? 'Rejeté' :
                                 'En attente'}
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* New comment form */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={newComments[content.id]?.author || ''}
                      onChange={(e) => setNewComments(prev => ({
                        ...prev,
                        [content.id]: { ...prev[content.id], author: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Votre commentaire"
                        value={newComments[content.id]?.text || ''}
                        onChange={(e) => setNewComments(prev => ({
                          ...prev,
                          [content.id]: { ...prev[content.id], text: e.target.value }
                        }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmitComment(content.id);
                          }
                        }}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleSubmitComment(content.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Send size={16} />
                        Envoyer
                      </button>
                    </div>
                    {submissionMessage?.contentId === content.id && (
                      <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {submissionMessage.message}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mt-4">
                  Publié le{' '}
                  {new Date(content.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}