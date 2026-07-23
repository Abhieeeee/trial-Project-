"use client";

import { useState } from "react";
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  likes: number;
}

const initialReviews: Review[] = [
  {
    id: "rev-1",
    author: "Aarav S.",
    rating: 5,
    date: "2026-07-18",
    title: "Unmatched Heavyweight Quality & Cyber Aesthetic",
    comment: "The 450 GSM organic fleece structure holds shape insanely well. Delivered to Kathmandu in under 48 hours via eSewa payment path. 10/10 techwear hoodie.",
    verified: true,
    likes: 24,
  },
  {
    id: "rev-2",
    author: "Kaito M.",
    rating: 5,
    date: "2026-07-14",
    title: "Perfect Oversized Fit with Tactical Precision",
    comment: "Water-resistant Japanese nylon paneling feels extremely premium. True to size for a high-street boxy silhouette.",
    verified: true,
    likes: 18,
  },
  {
    id: "rev-3",
    author: "Elena R.",
    rating: 4,
    date: "2026-07-02",
    title: "High-Density Embroidery & Solid Build",
    comment: "Materials are 100% luxury grade. Would love even more colorway drops in the future!",
    verified: true,
    likes: 9,
  },
];

export default function ProductReviews({ productName }: { productName: string }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: authorName,
      rating: selectedRating,
      date: new Date().toISOString().split("T")[0],
      title: reviewTitle || "Verified Customer Review",
      comment: reviewComment,
      verified: true,
      likes: 1,
    };

    setReviews([newRev, ...reviews]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setModalOpen(false);
      setAuthorName("");
      setReviewTitle("");
      setReviewComment("");
    }, 1500);
  };

  const handleLike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  return (
    <section className="mt-20 border-t border-neutral-900 pt-16 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 font-mono">
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#00d2ff] font-bold">
            COMMUNITY TELEMETRY & REVIEWS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-white font-display mt-2">
            Verified Customer Ratings
          </h2>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3.5 bg-[#00d2ff] text-black hover:bg-cyan-400 font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.2)] w-fit"
        >
          <MessageSquarePlus className="w-4 h-4" /> Write a Review
        </button>
      </div>

      {/* Ratings Breakdown Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 border border-neutral-850 bg-neutral-950/60 rounded-xl mb-12 font-mono">
        <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-neutral-850 pb-6 md:pb-0 md:pr-6">
          <span className="text-6xl font-black text-white font-display">{averageRating}</span>
          <div className="flex items-center gap-1 my-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
            Based on {reviews.length} Verified Buyer Ratings
          </span>
        </div>

        <div className="col-span-2 space-y-2 text-[10px] uppercase tracking-wider text-neutral-400 justify-center flex flex-col">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const percent = (count / reviews.length) * 100;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-12 text-white font-bold">{stars} Stars</span>
                <div className="flex-1 h-2 bg-black border border-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-neutral-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 font-mono">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 border border-neutral-900 bg-black/60 rounded-xl space-y-3 hover:border-neutral-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= rev.rating ? "fill-amber-400" : "text-neutral-800"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-white uppercase">{rev.author}</span>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-[9px] text-neutral-500">{rev.date}</span>
            </div>

            <h4 className="text-sm font-bold text-white uppercase font-display">{rev.title}</h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">{rev.comment}</p>

            <div className="pt-2 flex items-center justify-between text-[9px] text-neutral-500 uppercase">
              <span>Was this review helpful?</span>
              <button
                onClick={() => handleLike(rev.id)}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3 h-3 text-[#00d2ff]" /> Helpful ({rev.likes})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-neutral-950 border border-neutral-800 p-8 rounded-xl space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
                  Submit Review for {productName}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-neutral-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {submittedMessage ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                    Review Submitted & Published!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-400 mb-2">
                      Star Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSelectedRating(star)}
                          className="p-2 border border-neutral-800 bg-black hover:border-amber-400 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= selectedRating ? "fill-amber-400 text-amber-400" : "text-neutral-700"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                      Your Name / Handle *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Aarav S."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-black border border-neutral-800 p-3 text-white uppercase text-[10px] focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                      Headline / Summary Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Incredible fabric quality and fit"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full bg-black border border-neutral-800 p-3 text-white uppercase text-[10px] focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                      Detailed Review Comments *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details on silhouette fit, fabric feel, or delivery speed..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-black border border-neutral-800 p-3 text-white uppercase text-[10px] focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#00d2ff] hover:bg-cyan-400 text-black font-bold text-[10px] uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                  >
                    Publish Verified Review
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
