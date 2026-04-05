'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Category } from '@/types/blog';

type ChronologyGroup = {
  year: string;
  months: Array<{ value: string; month: string; count: number }>;
  total: number;
};

type BlogSidebarProps = {
  categories: Category[];
  chronologyGroups: ChronologyGroup[];
  activeCategory: Category | null;
  activeCategoryId: string | null;
  activeChronology: string | null;
  expandedYears: string[];
  chronologyCount: number;
  onCategoryClick: (categoryId: string) => void;
  onCategoryClear: () => void;
  onChronologyClick: (value: string) => void;
  onChronologyClear: () => void;
  onYearToggle: (year: string) => void;
};

export default function BlogSidebar({
  categories,
  chronologyGroups,
  activeCategory,
  activeCategoryId,
  activeChronology,
  expandedYears,
  chronologyCount,
  onCategoryClick,
  onCategoryClear,
  onChronologyClick,
  onChronologyClear,
  onYearToggle,
}: BlogSidebarProps) {
  return (
    <Card sx={{ position: { lg: 'sticky' }, top: { lg: 96 } }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
          {activeCategory ? `Filtered by ${activeCategory.cname}` : `${categories.length} categories`}
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        <List disablePadding>
          {categories.map((category) => (
            <ListItemButton
              key={category.id || category.cid}
              onClick={() => onCategoryClick(category.id)}
              selected={activeCategoryId === category.id}
              sx={{
                borderRadius: 1.5,
                px: 1,
                py: 0.5,
                minHeight: 36,
                '&.Mui-selected': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <ListItemText
                primary={category.cname}
                primaryTypographyProps={{
                  variant: 'body1',
                  color: activeCategoryId === category.id ? 'text.primary' : 'text.secondary',
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ marginY: 3 }} />

        <Typography variant="h6" gutterBottom>
          Chronology
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
          {activeChronology
            ? `Filtered by ${formatChronologyLabel(activeChronology)}`
            : `${chronologyCount} archives`}
        </Typography>

        <List disablePadding sx={{ mt: 1 }}>
          {chronologyGroups.map((group) => {
            const isExpanded = expandedYears.includes(group.year);

            return (
              <Box key={group.year}>
                <ListItemButton
                  onClick={() => onYearToggle(group.year)}
                  sx={{
                    borderRadius: 1.5,
                    px: 1,
                    py: 0.5,
                    minHeight: 40,
                  }}
                >
                  <ListItemText
                    primary={group.year}
                    primaryTypographyProps={{
                      variant: 'h6',
                      fontWeight: 400,
                      color: 'text.primary',
                    }}
                  />
                  <Box
                    sx={{
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                    }}
                  >
                    {isExpanded ? <ExpandLessIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                  </Box>
                </ListItemButton>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 2.5, pb: 0.5 }}>
                    {group.months.map((item) => (
                      <ListItemButton
                        key={item.value}
                        onClick={() => onChronologyClick(item.value)}
                        selected={activeChronology === item.value}
                        sx={{
                          borderRadius: 1.5,
                          py: 0.25,
                          pl: 1,
                          minHeight: 32,
                          '&.Mui-selected': {
                            backgroundColor: 'action.hover',
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: 'action.selected',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              color:
                                activeChronology === item.value ? 'text.primary' : 'text.secondary',
                            }}
                          >
                            {group.year}-{item.month}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                            ({item.count})
                          </Typography>
                        </Box>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>

        {activeChronology && (
          <Box sx={{ mt: 1.5 }}>
            <Box
              onClick={onChronologyClear}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                cursor: 'pointer',
              }}
            >
              <Typography variant="caption">清除日期筛选</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function formatChronologyLabel(value: string) {
  const match = value.match(/^(\d{4})(\d{2})\((\d+)\)$/);
  if (!match) {
    return value;
  }

  const [, year, month, count] = match;
  return `${year}-${month} (${count})`;
}
