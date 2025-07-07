import { MESSAGE_TEMPLATES } from "@/constants/chatConfig";
import { useLocalStorage } from "@/hooks/useLocalStorage";
export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: keyof typeof MESSAGE_TEMPLATES | "custom";
  isCustom: boolean;
  createdAt: Date;
  usageCount: number;
}
export const getPredefinedTemplates = (): MessageTemplate[] => {
  const templates: MessageTemplate[] = [];
  Object.entries(MESSAGE_TEMPLATES).forEach(([category, messages]) => {
    messages.forEach((content, index) => {
      templates.push({
        id: `${category}_${index}`,
        name: `${category.replace("_", " ")} ${index + 1}`,
        content,
        category: category as keyof typeof MESSAGE_TEMPLATES,
        isCustom: false,
        createdAt: new Date(),
        usageCount: 0,
      });
    });
  });
  return templates;
};
export const useMessageTemplates = () => {
  const [customTemplates, setCustomTemplates] = useLocalStorage<
    MessageTemplate[]
  >("CHAT_TEMPLATES", []);
  const getAllTemplates = (): MessageTemplate[] => {
    const predefined = getPredefinedTemplates();
    return [...predefined, ...customTemplates];
  };
  const addCustomTemplate = (
    name: string,
    content: string
  ): MessageTemplate => {
    const newTemplate: MessageTemplate = {
      id: `custom_${Date.now()}`,
      name,
      content,
      category: "custom",
      isCustom: true,
      createdAt: new Date(),
      usageCount: 0,
    };
    setCustomTemplates((prev) => [...prev, newTemplate]);
    return newTemplate;
  };
  const updateTemplate = (
    id: string,
    updates: Partial<MessageTemplate>
  ): void => {
    setCustomTemplates((prev) =>
      prev.map((template) =>
        template.id === id ? { ...template, ...updates } : template
      )
    );
  };
  const deleteTemplate = (id: string): void => {
    setCustomTemplates((prev) => prev.filter((template) => template.id !== id));
  };
  const incrementUsage = (id: string): void => {
    const allTemplates = getAllTemplates();
    const template = allTemplates.find((t) => t.id === id);
    if (template && template.isCustom) {
      updateTemplate(id, { usageCount: template.usageCount + 1 });
    }
  };
  const getTemplatesByCategory = (
    category: keyof typeof MESSAGE_TEMPLATES | "custom"
  ) => {
    return getAllTemplates().filter(
      (template) => template.category === category
    );
  };
  const searchTemplates = (query: string): MessageTemplate[] => {
    const lowercaseQuery = query.toLowerCase();
    return getAllTemplates().filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.content.toLowerCase().includes(lowercaseQuery)
    );
  };
  const getPopularTemplates = (limit: number = 5): MessageTemplate[] => {
    return getAllTemplates()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  };
  return {
    getAllTemplates,
    addCustomTemplate,
    updateTemplate,
    deleteTemplate,
    incrementUsage,
    getTemplatesByCategory,
    searchTemplates,
    getPopularTemplates,
    customTemplates,
  };
};
export const getAutoCompleteSuggestions = (
  input: string,
  templates: MessageTemplate[]
): MessageTemplate[] => {
  if (input.length < 2) return [];
  const lowercaseInput = input.toLowerCase();
  return templates
    .filter((template) =>
      template.content.toLowerCase().startsWith(lowercaseInput)
    )
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 3);
};
export const getContextualSuggestions = (
  swapRequestStatus: string,
  messageHistory: string[]
): MessageTemplate[] => {
  const predefinedTemplates = getPredefinedTemplates();
  const lastMessage =
    messageHistory[messageHistory.length - 1]?.toLowerCase() || "";
  if (lastMessage.includes("interested") || lastMessage.includes("available")) {
    return predefinedTemplates.filter(
      (t) => t.category === "SWAP_CONFIRMATION"
    );
  }
  if (
    lastMessage.includes("meet") ||
    lastMessage.includes("time") ||
    lastMessage.includes("place")
  ) {
    return predefinedTemplates.filter(
      (t) => t.category === "MEETING_ARRANGEMENT"
    );
  }
  if (swapRequestStatus === "pending" && messageHistory.length === 0) {
    return predefinedTemplates.filter((t) => t.category === "SWAP_INTEREST");
  }
  if (swapRequestStatus === "completed") {
    return predefinedTemplates.filter((t) => t.category === "CLOSING");
  }
  return predefinedTemplates.filter((t) => t.category === "POLITE_RESPONSES");
};
