import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { RANK_COLORS } from "@/config/ranksColors";

export default function LeaderboardItem({ user, position, isCurrentUser = false }) {
  const navigate = useNavigate();
  const rankColor = RANK_COLORS[user.rango_global] || RANK_COLORS["Sin Rango"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(position * 0.04, 0.6) }}
      onClick={() => navigate(`/profile/${user.username}`)}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all active:scale-[0.98] rounded-xl mx-2 mb-1.5 ${
        isCurrentUser
          ? "bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5"
          : "bg-zinc-900/50 hover:bg-zinc-800/60 border border-transparent"
      }`}
    >
      {/* Posición */}
      <span className={`text-sm font-black w-7 text-center tabular-nums ${
        isCurrentUser ? "text-primary" : "text-muted-foreground"
      }`}>
        #{position}
      </span>

      {/* Avatar */}
      <div className="relative">
        <Avatar
          className="h-10 w-10 border-2"
          style={{ borderColor: rankColor }}
        >
          <AvatarImage src={user.foto_perfil} className="object-cover" />
          <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-xs">
            {user.username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${
          isCurrentUser ? "text-primary" : "text-foreground"
        }`}>
          {user.username}
          {isCurrentUser && (
            <span className="ml-1.5 text-[10px] font-medium text-primary/70">(Tú)</span>
          )}
        </p>
        <Badge
          variant="outline"
          className="mt-0.5 text-[10px] px-1.5 py-0 h-4 border-transparent"
          style={{ color: rankColor, backgroundColor: `${rankColor}15` }}
        >
          {user.rango_global || "Sin Rango"}
        </Badge>
      </div>

      {/* Score */}
      <div className="text-right">
        <p className={`text-sm font-black tabular-nums ${
          isCurrentUser ? "text-primary" : "text-foreground"
        }`}>
          {user.score.toFixed(1)}
        </p>
        <p className="text-[10px] text-muted-foreground">pts</p>
      </div>
    </motion.div>
  );
}
