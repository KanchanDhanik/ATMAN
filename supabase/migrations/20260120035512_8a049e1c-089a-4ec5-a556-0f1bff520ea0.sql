-- Add conversation_type column to track voice vs text chats
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS conversation_type text DEFAULT 'text';

-- Add emotion column to store detected emotion during conversation
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS emotion text;

-- Add language column to track conversation language
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS language text DEFAULT 'English';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_conversations_type ON public.conversations(conversation_type);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);